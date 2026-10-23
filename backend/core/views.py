from django.utils import timezone
from django.db.models import Sum, Count, Avg
from django.db import IntegrityError
from rest_framework import generics, status, views, permissions
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

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
from .serializers import (
    UserSerializer,
    PublicRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    OperatorSerializer,
    ProjectSerializer,
    TaskSerializer,
    ActivityRecordSerializer,
    ProjectDocumentSerializer,
    AttendanceRecordSerializer,
    AuditLogSerializer
)
from .permissions import (
    IsActiveAccount,
    IsAdminRole,
    IsOperatorRole,
    IsClientViewerRole,
    IsClientReadOnly
)

# ----------------- AUTHENTICATION -----------------

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class PublicRegistrationView(generics.CreateAPIView):
    serializer_class = PublicRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = serializer.save()
        except IntegrityError as exc:
            raise ValidationError({
                'detail': 'That username or email is already registered. Please sign in instead.'
            }) from exc

        return Response(
            {
                'message': 'Registration successful. You can now sign in.',
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class CurrentUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsActiveAccount]

    def get(self, request):
        serializer = UserSerializer(request.user)
        data = serializer.data
        if hasattr(request.user, 'operator_profile'):
            data['operator_id'] = request.user.operator_profile.operator_id
            data['assigned_project_id'] = request.user.operator_profile.project_id
            data['assigned_project_name'] = (
                request.user.operator_profile.project.project_name
                if request.user.operator_profile.project else None
            )
        return Response(data)


# ----------------- ADMIN PORTAL VIEWS -----------------

class AdminDashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        today = timezone.now().date()

        total_projects = Project.objects.count()
        active_operators = Operator.objects.filter(status='ACTIVE').count()
        today_attendance = AttendanceRecord.objects.filter(date=today, status='PRESENT').count()
        total_production = ActivityRecord.objects.filter(status='APPROVED').aggregate(Sum('quantity'))['quantity__sum'] or 0.0
        pending_approvals = ActivityRecord.objects.filter(status='PENDING').count()

        # Recent activities
        recent_activities = ActivityRecordSerializer(
            ActivityRecord.objects.all().order_by('-created_at')[:8], many=True
        ).data

        # Recent audit logs
        recent_audit_logs = AuditLogSerializer(
            AuditLog.objects.all().order_by('-timestamp')[:8], many=True
        ).data

        # Project progress breakdown
        projects = ProjectSerializer(Project.objects.all()[:6], many=True).data

        return Response({
            'total_projects': total_projects,
            'active_operators': active_operators,
            'today_attendance': today_attendance,
            'total_production_quantity': round(total_production, 2),
            'pending_approvals': pending_approvals,
            'recent_activities': recent_activities,
            'recent_audit_logs': recent_audit_logs,
            'projects': projects,
        })


class AdminOperatorListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def get(self, request):
        operators = Operator.objects.all().select_related('user', 'project')
        return Response(OperatorSerializer(operators, many=True).data)

    def post(self, request):
        data = request.data
        email = data.get('email')
        name = data.get('name')
        password = data.get('password')
        employee_id = data.get('employee_id')
        department = data.get('department', 'General Operations')
        project_id = data.get('project')
        shift = data.get('shift', 'Morning')

        if not email or not name or not employee_id:
            return Response(
                {"error": "Name, email, and employee ID are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not isinstance(password, str) or len(password) < 8:
            return Response(
                {"error": "An initial password of at least 8 characters is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {"error": "A user with this email address already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Operator.objects.filter(employee_id=employee_id).exists():
            return Response(
                {"error": "An operator with this employee ID already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 1. Create User
        username = email.split('@')[0]
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            name=name,
            role='OPERATOR',
            status='ACTIVE'
        )

        # 2. Create Operator Profile with auto-generated ID (IND-OP-XXXX)
        project = Project.objects.filter(id=project_id).first() if project_id else None
        operator = Operator.objects.create(
            user=user,
            name=name,
            employee_id=employee_id,
            department=department,
            project=project,
            site=project.site if project else '',
            shift=shift,
            status='ACTIVE'
        )

        # 3. Record Audit Log
        AuditLog.objects.create(
            user=request.user,
            user_email=request.user.email,
            role=request.user.role,
            action="OPERATOR_ACCOUNT_CREATED",
            target=f"Operator: {operator.operator_id} ({operator.name})",
            ip_address=request.META.get('REMOTE_ADDR', '127.0.0.1')
        )

        return Response(OperatorSerializer(operator).data, status=status.HTTP_201_CREATED)


class AdminOperatorDetailView(generics.RetrieveUpdateAPIView):
    queryset = Operator.objects.all()
    serializer_class = OperatorSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_update(self, serializer):
        operator = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            user_email=self.request.user.email,
            role=self.request.user.role,
            action="OPERATOR_UPDATED",
            target=f"Operator: {operator.operator_id}",
            ip_address=self.request.META.get('REMOTE_ADDR', '127.0.0.1')
        )


class AdminProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_create(self, serializer):
        proj = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            user_email=self.request.user.email,
            role=self.request.user.role,
            action="PROJECT_CREATED",
            target=f"Project: {proj.project_name}",
            ip_address=self.request.META.get('REMOTE_ADDR', '127.0.0.1')
        )


class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def perform_update(self, serializer):
        proj = serializer.save()
        AuditLog.objects.create(
            user=self.request.user,
            user_email=self.request.user.email,
            role=self.request.user.role,
            action="PROJECT_UPDATED",
            target=f"Project: {proj.project_name}",
            ip_address=self.request.META.get('REMOTE_ADDR', '127.0.0.1')
        )


class AdminActivityApprovalView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]

    def post(self, request, pk):
        record = ActivityRecord.objects.filter(pk=pk).first()
        if not record:
            return Response({"error": "Activity record not found."}, status=status.HTTP_404_NOT_FOUND)

        action_type = request.data.get('action') # 'approve' or 'reject'
        remarks = request.data.get('remarks', '')

        if action_type == 'approve':
            record.status = 'APPROVED'
            record.approved_by = request.user
            record.remarks = remarks
            record.save()
            action_desc = "ACTIVITY_RECORD_APPROVED"
        elif action_type == 'reject':
            record.status = 'REJECTED'
            record.approved_by = request.user
            record.remarks = remarks
            record.save()
            action_desc = "ACTIVITY_RECORD_REJECTED"
        else:
            return Response({"error": "Action must be 'approve' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)

        # Audit Log
        AuditLog.objects.create(
            user=request.user,
            user_email=request.user.email,
            role=request.user.role,
            action=action_desc,
            target=f"Activity #{record.id} ({record.activity})",
            ip_address=request.META.get('REMOTE_ADDR', '127.0.0.1')
        )

        return Response(ActivityRecordSerializer(record).data)


class AdminAuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminRole]


# ----------------- OPERATOR PORTAL VIEWS -----------------

class OperatorDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsOperatorRole]

    def get(self, request):
        user = request.user
        operator = getattr(user, 'operator_profile', None)

        if not operator:
            return Response({"error": "No operator profile linked."}, status=status.HTTP_404_NOT_FOUND)

        # Tasks assigned to this operator
        tasks = Task.objects.filter(operator=operator)
        today_tasks = tasks.filter(status__in=['TODO', 'IN_PROGRESS'])

        # Personal activity logs
        activities = ActivityRecord.objects.filter(operator=operator)
        approved_count = activities.filter(status='APPROVED').count()
        pending_count = activities.filter(status='PENDING').count()

        return Response({
            'operator_id': operator.operator_id,
            'operator_name': operator.name,
            'employee_id': operator.employee_id,
            'department': operator.department,
            'assigned_project': operator.project.project_name if operator.project else "Unassigned",
            'assigned_site': operator.site or (operator.project.site if operator.project else "N/A"),
            'shift': operator.shift,
            'total_assigned_tasks': tasks.count(),
            'active_tasks_count': today_tasks.count(),
            'approved_activities': approved_count,
            'pending_activities': pending_count,
            'recent_tasks': TaskSerializer(tasks[:6], many=True).data,
            'recent_activities': ActivityRecordSerializer(activities[:6], many=True).data,
        })


class OperatorTaskListView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOperatorRole]

    def get_queryset(self):
        operator = getattr(self.request.user, 'operator_profile', None)
        if not operator:
            return Task.objects.none()
        return Task.objects.filter(operator=operator)


class OperatorTaskStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsOperatorRole]

    def patch(self, request, pk):
        operator = getattr(request.user, 'operator_profile', None)
        task = Task.objects.filter(pk=pk).first()

        if not task:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        # STRICT OWNERSHIP CHECK: Operator can only update tasks assigned to them
        if not request.user.is_admin() and task.operator != operator:
            return Response(
                {"error": "Access Denied: You cannot update tasks assigned to other operators."},
                status=status.HTTP_403_FORBIDDEN
            )

        new_status = request.data.get('status')
        if new_status not in ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']:
            return Response({"error": "Invalid status option."}, status=status.HTTP_400_BAD_REQUEST)

        task.status = new_status
        if new_status == 'COMPLETED':
            task.completed_date = timezone.now().date()
        task.save()

        # Audit Log
        AuditLog.objects.create(
            user=request.user,
            user_email=request.user.email,
            role=request.user.role,
            action="TASK_STATUS_UPDATED",
            target=f"Task #{task.id} -> {new_status}",
            ip_address=request.META.get('REMOTE_ADDR', '127.0.0.1')
        )

        return Response(TaskSerializer(task).data)


class OperatorActivityRecordListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsOperatorRole]

    def get(self, request):
        operator = getattr(request.user, 'operator_profile', None)
        if not operator:
            return Response([])
        records = ActivityRecord.objects.filter(operator=operator)
        return Response(ActivityRecordSerializer(records, many=True).data)

    def post(self, request):
        operator = getattr(request.user, 'operator_profile', None)
        if not operator or not operator.project:
            return Response(
                {"error": "Operator is not assigned to an active project site."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data
        activity = data.get('activity')
        quantity = data.get('quantity')
        unit = data.get('unit', 'Units')

        if not activity or quantity is None:
            return Response(
                {"error": "Activity description and quantity are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            qty_float = float(quantity)
            if qty_float <= 0:
                return Response({"error": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response({"error": "Valid numeric quantity required."}, status=status.HTTP_400_BAD_REQUEST)

        rec = ActivityRecord.objects.create(
            project=operator.project,
            operator=operator,
            activity=activity,
            quantity=qty_float,
            unit=unit,
            date=timezone.now().date(),
            status='PENDING',
            remarks=data.get('remarks', '')
        )

        # Audit Log
        AuditLog.objects.create(
            user=request.user,
            user_email=request.user.email,
            role=request.user.role,
            action="DAILY_ACTIVITY_SUBMITTED",
            target=f"Activity #{rec.id} ({rec.activity} - {rec.quantity} {rec.unit})",
            ip_address=request.META.get('REMOTE_ADDR', '127.0.0.1')
        )

        return Response(ActivityRecordSerializer(rec).data, status=status.HTTP_201_CREATED)


# ----------------- CLIENT VIEWER PORTAL (STRICTLY READ-ONLY) -----------------

class ClientDashboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsClientViewerRole, IsClientReadOnly]

    def get(self, request):
        user = request.user

        # Projects linked to this client, or all active projects if unassigned
        client_projects = Project.objects.filter(client=user)
        if not client_projects.exists():
            client_projects = Project.objects.all()

        project = client_projects.first()

        if not project:
            return Response({
                "project_name": "No Project Assigned",
                "status": "N/A",
                "progress_percentage": 0,
                "approved_reports": [],
                "production_summary": 0.0,
                "milestones": [],
                "documents": []
            })

        # Only APPROVED activity records are visible to client
        approved_activities = ActivityRecord.objects.filter(project=project, status='APPROVED')
        total_approved_output = approved_activities.aggregate(Sum('quantity'))['quantity__sum'] or 0.0

        # Permitted documents
        documents = ProjectDocument.objects.filter(project=project, is_approved_for_client=True)

        # Milestone tracking from completed tasks
        milestones = Task.objects.filter(project=project, status='COMPLETED')[:5]

        return Response({
            'project_name': project.project_name,
            'site': project.site,
            'status': project.status,
            'progress_percentage': project.progress_percentage,
            'start_date': project.start_date,
            'end_date': project.end_date,
            'total_approved_output': round(total_approved_output, 2),
            'approved_activities': ActivityRecordSerializer(approved_activities[:8], many=True).data,
            'documents': ProjectDocumentSerializer(documents, many=True).data,
            'completed_milestones': TaskSerializer(milestones, many=True).data,
        })


class ClientDocumentsView(generics.ListAPIView):
    serializer_class = ProjectDocumentSerializer
    permission_classes = [permissions.IsAuthenticated, IsClientViewerRole, IsClientReadOnly]

    def get_queryset(self):
        return ProjectDocument.objects.filter(is_approved_for_client=True)


class ClientReportsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsClientViewerRole, IsClientReadOnly]

    def get(self, request):
        approved = ActivityRecord.objects.filter(status='APPROVED')
        return Response(ActivityRecordSerializer(approved, many=True).data)


# ----------------- SECURITY AUDIT LOGGING -----------------

class LogAccessDeniedView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        attempted_path = request.data.get('attempted_path', 'Unknown')
        AuditLog.objects.create(
            user=request.user,
            user_email=request.user.email,
            role=request.user.role,
            action="UNAUTHORIZED_ACCESS_ATTEMPT_BLOCKED",
            target=f"Path: {attempted_path}",
            ip_address=request.META.get('REMOTE_ADDR', '127.0.0.1')
        )
        return Response({"status": "Logged"}, status=status.HTTP_200_OK)
