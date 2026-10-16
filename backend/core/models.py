import re
from django.db import models, transaction
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('OPERATOR', 'Operator'),
        ('CLIENT_VIEWER', 'Client Viewer'),
    )
    
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )

    name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)
    age = models.PositiveIntegerField(null=True, blank=True)
    designation = models.CharField(max_length=150, blank=True)
    employee_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='OPERATOR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = f"{self.first_name} {self.last_name}".strip() or self.username
        super().save(*args, **kwargs)

    def is_admin(self):
        return self.role == 'ADMIN' or self.is_superuser

    def is_operator(self):
        return self.role == 'OPERATOR'

    def is_client_viewer(self):
        return self.role == 'CLIENT_VIEWER'

    def __str__(self):
        return f"{self.name} ({self.role}) - {self.email}"


class Project(models.Model):
    STATUS_CHOICES = (
        ('PLANNED', 'Planned'),
        ('IN_PROGRESS', 'In Progress'),
        ('UNDER_REVIEW', 'Under Review'),
        ('COMPLETED', 'Completed'),
        ('ON_HOLD', 'On Hold'),
    )

    project_name = models.CharField(max_length=200)
    client = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='client_projects',
        limit_choices_to={'role': 'CLIENT_VIEWER'}
    )
    site = models.CharField(max_length=200)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='IN_PROGRESS')
    progress_percentage = models.PositiveIntegerField(default=0)
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project_name} ({self.site}) - {self.progress_percentage}%"


class Operator(models.Model):
    SHIFT_CHOICES = (
        ('Morning', 'Morning (06:00 - 14:00)'),
        ('Afternoon', 'Afternoon (14:00 - 22:00)'),
        ('Night', 'Night (22:00 - 06:00)'),
    )

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
    )

    operator_id = models.CharField(max_length=50, unique=True, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='operator_profile')
    name = models.CharField(max_length=150)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, default='General Operations')
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_operators')
    site = models.CharField(max_length=200, blank=True, default='')
    shift = models.CharField(max_length=50, choices=SHIFT_CHOICES, default='Morning')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['operator_id']

    @classmethod
    def generate_next_operator_id(cls):
        """
        Generates unique Operator ID in strict format: IND-OP-0001, IND-OP-0002...
        Never duplicates IDs.
        """
        with transaction.atomic():
            last_op = cls.objects.select_for_update().order_by('-id').first()
            if not last_op:
                return "IND-OP-0001"
            
            # Find the highest existing integer suffix
            existing_ids = cls.objects.values_list('operator_id', flat=True)
            max_num = 0
            for op_id in existing_ids:
                match = re.search(r'IND-OP-(\d+)', op_id)
                if match:
                    num = int(match.group(1))
                    if num > max_num:
                        max_num = num
            
            next_num = max_num + 1
            return f"IND-OP-{next_num:04d}"

    def save(self, *args, **kwargs):
        if not self.operator_id:
            self.operator_id = self.generate_next_operator_id()
        if not self.name and self.user:
            self.name = self.user.name
        if self.project and not self.site:
            self.site = self.project.site
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.operator_id} - {self.name} ({self.department})"


class Task(models.Model):
    STATUS_CHOICES = (
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
        ('BLOCKED', 'Blocked'),
    )

    PRIORITY_CHOICES = (
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name='assigned_tasks')
    task_name = models.CharField(max_length=250)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='TODO')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    assigned_date = models.DateField(default=timezone.now)
    completed_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ['-assigned_date', '-id']

    def __str__(self):
        return f"{self.task_name} [{self.status}] -> {self.operator.operator_id}"


class ActivityRecord(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activity_records')
    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name='activity_records')
    activity = models.CharField(max_length=250)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50, default='Units')
    date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PENDING')
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_activities')
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"{self.activity} ({self.quantity} {self.unit}) - {self.status}"


class ProjectDocument(models.Model):
    DOC_TYPES = (
        ('Blueprint', 'Engineering Blueprint'),
        ('Quality', 'Quality Assurance Report'),
        ('Safety', 'Safety & Environmental Audit'),
        ('Milestone', 'Milestone Completion Proof'),
        ('Progress', 'Approved Progress Report'),
    )

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='documents')
    title = models.CharField(max_length=250)
    document_type = models.CharField(max_length=50, choices=DOC_TYPES, default='Progress')
    file_url = models.CharField(max_length=500, default='/docs/sample-spec.pdf')
    is_approved_for_client = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.document_type})"


class AttendanceRecord(models.Model):
    STATUS_CHOICES = (
        ('PRESENT', 'Present'),
        ('LATE', 'Late'),
        ('ON_LEAVE', 'On Leave'),
        ('ABSENT', 'Absent'),
    )

    operator = models.ForeignKey(Operator, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    shift = models.CharField(max_length=50, default='Morning')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='PRESENT')
    check_in_time = models.TimeField(null=True, blank=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('operator', 'date')

    def __str__(self):
        return f"{self.operator.operator_id} - {self.date} - {self.status}"


class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    user_email = models.CharField(max_length=150)
    role = models.CharField(max_length=30)
    action = models.CharField(max_length=150)
    target = models.CharField(max_length=250)
    ip_address = models.GenericIPAddressField(default='127.0.0.1')
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] {self.user_email} ({self.role}): {self.action} on {self.target}"
