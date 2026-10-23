from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomLoginView,
    PublicRegistrationView,
    CurrentUserView,
    AdminDashboardStatsView,
    AdminOperatorListCreateView,
    AdminOperatorDetailView,
    AdminProjectListCreateView,
    AdminProjectDetailView,
    AdminActivityApprovalView,
    AdminAuditLogListView,
    OperatorDashboardView,
    OperatorTaskListView,
    OperatorTaskStatusUpdateView,
    OperatorActivityRecordListCreateView,
    ClientDashboardView,
    ClientReportsView,
    ClientDocumentsView,
    LogAccessDeniedView,
)

urlpatterns = [
    # Authentication
    path('auth/register/', PublicRegistrationView.as_view(), name='auth_register'),
    path('auth/login/', CustomLoginView.as_view(), name='auth_login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),

    # Admin Endpoints
    path('admin/dashboard/', AdminDashboardStatsView.as_view(), name='admin_dashboard'),
    path('admin/operators/', AdminOperatorListCreateView.as_view(), name='admin_operators'),
    path('admin/operators/<int:pk>/', AdminOperatorDetailView.as_view(), name='admin_operator_detail'),
    path('admin/projects/', AdminProjectListCreateView.as_view(), name='admin_projects'),
    path('admin/projects/<int:pk>/', AdminProjectDetailView.as_view(), name='admin_project_detail'),
    path('admin/activities/<int:pk>/approve/', AdminActivityApprovalView.as_view(), name='admin_activity_approve'),
    path('admin/audit-logs/', AdminAuditLogListView.as_view(), name='admin_audit_logs'),

    # Operator Endpoints
    path('operator/dashboard/', OperatorDashboardView.as_view(), name='operator_dashboard'),
    path('operator/tasks/', OperatorTaskListView.as_view(), name='operator_tasks'),
    path('operator/tasks/<int:pk>/status/', OperatorTaskStatusUpdateView.as_view(), name='operator_task_status'),
    path('operator/records/', OperatorActivityRecordListCreateView.as_view(), name='operator_records'),

    # Client Viewer Endpoints (Strictly Read-Only)
    path('client/dashboard/', ClientDashboardView.as_view(), name='client_dashboard'),
    path('client/reports/', ClientReportsView.as_view(), name='client_reports'),
    path('client/documents/', ClientDocumentsView.as_view(), name='client_documents'),

    # Security Log
    path('security/log-access-denied/', LogAccessDeniedView.as_view(), name='log_access_denied'),
]
