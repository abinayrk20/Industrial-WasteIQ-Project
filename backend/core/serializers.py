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


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
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
