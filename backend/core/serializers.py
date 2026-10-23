from uuid import uuid4
from django.contrib.auth.password_validation import validate_password as validate_django_password
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    User,
    Project,
    Operator,
    Task,
    ActivityRecord,
    ProjectDocument,
    AttendanceRecord,
    AuditLog
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'status', 'created_at')
        read_only_fields = ('id', 'created_at')


class PublicRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(
        max_length=150,
        validators=[UnicodeUsernameValidator()],
    )
    name = serializers.CharField(max_length=150)
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)
    role = serializers.CharField()
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_username(self, value):
        value = value.strip()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already registered.')
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate_password(self, value):
        try:
            validate_django_password(value)
        except DjangoValidationError as exc:
            raise serializers.ValidationError(list(exc.messages)) from exc
        return value

    def validate_role(self, value):
        if value not in ('OPERATOR', 'CLIENT_VIEWER'):
            raise serializers.ValidationError(
                'Admin accounts can only be created by an authorized administrator.'
            )
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {'confirm_password': 'Passwords do not match.'}
            )
        attrs['name'] = attrs['name'].strip()
        if not attrs['name']:
            raise serializers.ValidationError({'name': 'Full name is required.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        department = validated_data.pop('department', '').strip()
        user = User.objects.create_user(
            password=password,
            status='ACTIVE',
            **validated_data,
        )

        if user.role == 'OPERATOR':
            Operator.objects.create(
                user=user,
                name=user.name,
                employee_id=f"REG-{uuid4().hex[:16].upper()}",
                department=department or 'General Operations',
            )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get(self.username_field)
        if identifier:
            matching_users = list(
                User.objects.filter(
                    Q(email__iexact=identifier.strip())
                    | Q(username__iexact=identifier.strip())
                    | Q(operator_profile__operator_id__iexact=identifier.strip())
                ).distinct()[:2]
            )
            if len(matching_users) == 1:
                attrs[self.username_field] = matching_users[0].email

        data = super().validate(attrs)
        
        # Check active status
        if self.user.status != 'ACTIVE' or not self.user.is_active:
            raise serializers.ValidationError("Account is inactive or suspended. Contact administrator.")

        operator_id = None
        if hasattr(self.user, 'operator_profile'):
            operator_id = self.user.operator_profile.operator_id

        data['user'] = {
            'id': self.user.id,
            'name': self.user.name,
            'email': self.user.email,
            'role': self.user.role,
            'status': self.user.status,
            'operator_id': operator_id,
        }

        # Record Login Audit Log
        AuditLog.objects.create(
            user=self.user,
            user_email=self.user.email,
            role=self.user.role,
            action="LOGIN_AUTHENTICATED",
            target="Authentication Gateway",
            ip_address="127.0.0.1"
        )

        return data


class OperatorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    project_name = serializers.CharField(source='project.project_name', read_only=True)

    class Meta:
        model = Operator
        fields = (
            'id',
            'operator_id',
            'user',
            'name',
            'email',
            'employee_id',
            'department',
            'project',
            'project_name',
            'site',
            'shift',
            'status',
            'created_at'
        )
        read_only_fields = ('id', 'operator_id', 'created_at')


class ProjectSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.name', read_only=True)
    task_count = serializers.SerializerMethodField()
    operator_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            'id',
            'project_name',
            'client',
            'client_name',
            'site',
            'status',
            'progress_percentage',
            'budget',
            'start_date',
            'end_date',
            'created_at',
            'task_count',
            'operator_count'
        )
        read_only_fields = ('id', 'created_at')

    def get_task_count(self, obj):
        return obj.tasks.count()

    def get_operator_count(self, obj):
        return obj.assigned_operators.count()


class TaskSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    operator_id_code = serializers.CharField(source='operator.operator_id', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id',
            'project',
            'project_name',
            'operator',
            'operator_name',
            'operator_id_code',
            'task_name',
            'description',
            'status',
            'priority',
            'assigned_date',
            'completed_date'
        )
        read_only_fields = ('id', 'assigned_date')


class ActivityRecordSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    operator_id_code = serializers.CharField(source='operator.operator_id', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.name', read_only=True)

    class Meta:
        model = ActivityRecord
        fields = (
            'id',
            'project',
            'project_name',
            'operator',
            'operator_name',
            'operator_id_code',
            'activity',
            'quantity',
            'unit',
            'date',
            'status',
            'approved_by',
            'approved_by_name',
            'remarks',
            'created_at'
        )
        read_only_fields = ('id', 'created_at', 'status', 'approved_by')


class ProjectDocumentSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.project_name', read_only=True)

    class Meta:
        model = ProjectDocument
        fields = (
            'id',
            'project',
            'project_name',
            'title',
            'document_type',
            'file_url',
            'is_approved_for_client',
            'created_at'
        )
        read_only_fields = ('id', 'created_at')


class AttendanceRecordSerializer(serializers.ModelSerializer):
    operator_name = serializers.CharField(source='operator.name', read_only=True)
    operator_id_code = serializers.CharField(source='operator.operator_id', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = (
            'id',
            'operator',
            'operator_name',
            'operator_id_code',
            'date',
            'shift',
            'status',
            'check_in_time'
        )
        read_only_fields = ('id',)


class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = (
            'id',
            'user_email',
            'role',
            'action',
            'target',
            'ip_address',
            'timestamp'
        )
        read_only_fields = ('id', 'timestamp')
