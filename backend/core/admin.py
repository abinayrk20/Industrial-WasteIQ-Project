from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
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

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'name', 'role', 'status', 'is_staff')
    list_filter = ('role', 'status', 'is_staff')
    ordering = ('email',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Permissions', {'fields': ('role', 'status', 'is_active', 'is_staff', 'is_superuser')}),
    )

@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = ('operator_id', 'name', 'employee_id', 'department', 'project', 'shift', 'status')
    list_filter = ('department', 'shift', 'status')
    search_fields = ('operator_id', 'name', 'employee_id')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('project_name', 'site', 'status', 'progress_percentage', 'client', 'start_date')
    list_filter = ('status',)
    search_fields = ('project_name', 'site')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('task_name', 'project', 'operator', 'status', 'priority', 'assigned_date')
    list_filter = ('status', 'priority')

@admin.register(ActivityRecord)
class ActivityRecordAdmin(admin.ModelAdmin):
    list_display = ('activity', 'project', 'operator', 'quantity', 'unit', 'status', 'date')
    list_filter = ('status', 'date')

@admin.register(ProjectDocument)
class ProjectDocumentAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'document_type', 'is_approved_for_client', 'created_at')

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('operator', 'date', 'shift', 'status', 'check_in_time')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user_email', 'role', 'action', 'target', 'ip_address')
    list_filter = ('role', 'action')
    search_fields = ('user_email', 'action', 'target')
    readonly_fields = ('timestamp', 'user', 'user_email', 'role', 'action', 'target', 'ip_address')
