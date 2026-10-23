import os
import django
from datetime import timedelta
from django.conf import settings
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import (
    User,
    Project,
    Operator,
    Task,
    ActivityRecord,
    ProjectDocument,
    AttendanceRecord,
    AuditLog
)

def _get_seed_user(email, username, name, role, password_env, *, is_staff=False, is_superuser=False):
    user = User.objects.filter(email=email).first()
    if user:
        return user

    password = os.environ.get(password_env)
    if not password:
        raise RuntimeError(f'{password_env} is required to create the sample user {email}.')

    return User.objects.create_user(
        username=username,
        email=email,
        password=password,
        name=name,
        role=role,
        status='ACTIVE',
        is_staff=is_staff,
        is_superuser=is_superuser,
    )


def run_seed():
    if not settings.DEBUG and os.environ.get('SEED_SAMPLE_DATA', '').lower() != 'true':
        raise RuntimeError(
            'Refusing to seed a production database. Set SEED_SAMPLE_DATA=true only when intentionally provisioning sample data.'
        )

    print("[*] Starting Industrial Project Management RBAC Seeder...")

    seed_users = (
        ('admin@industrial.com', 'SEED_ADMIN_PASSWORD'),
        ('client@industrial.com', 'SEED_CLIENT_PASSWORD'),
        ('operator01@industrial.com', 'SEED_OPERATOR01_PASSWORD'),
        ('operator02@industrial.com', 'SEED_OPERATOR02_PASSWORD'),
    )
    missing_passwords = [
        password_env
        for email, password_env in seed_users
        if not User.objects.filter(email=email).exists() and not os.environ.get(password_env)
    ]
    if missing_passwords:
        raise RuntimeError(
            'Set these environment variables before creating sample users: '
            + ', '.join(missing_passwords)
        )

    admin_user = _get_seed_user(
        'admin@industrial.com',
        'admin',
        'Marcus Vance (Executive Director)',
        'ADMIN',
        'SEED_ADMIN_PASSWORD',
        is_staff=True,
        is_superuser=True,
    )
    client_user = _get_seed_user(
        'client@industrial.com',
        'client',
        'Apex Global Energy Ltd. (Client Representative)',
        'CLIENT_VIEWER',
        'SEED_CLIENT_PASSWORD',
    )
    op1_user = _get_seed_user(
        'operator01@industrial.com',
        'operator01',
        'David Chen',
        'OPERATOR',
        'SEED_OPERATOR01_PASSWORD',
    )
    op2_user = _get_seed_user(
        'operator02@industrial.com',
        'operator02',
        'Elena Rostova',
        'OPERATOR',
        'SEED_OPERATOR02_PASSWORD',
    )

    # 5. PROJECTS
    p1, _ = Project.objects.get_or_create(
        project_name="Titan Offshore Wind Turbine Array",
        defaults={
            'client': client_user,
            'site': 'North Sea Sector 4 - Platform B',
            'status': 'IN_PROGRESS',
            'progress_percentage': 68,
            'budget': 4500000.00,
            'start_date': timezone.now().date() - timedelta(days=90),
            'end_date': timezone.now().date() + timedelta(days=120),
        }
    )

    p2, _ = Project.objects.get_or_create(
        project_name="Bio-Polymer Synthesis Plant Revamp",
        defaults={
            'client': client_user,
            'site': 'Rotterdam Chemical Complex - Unit 7',
            'status': 'IN_PROGRESS',
            'progress_percentage': 42,
            'budget': 2800000.00,
            'start_date': timezone.now().date() - timedelta(days=45),
            'end_date': timezone.now().date() + timedelta(days=180),
        }
    )

    p3, _ = Project.objects.get_or_create(
        project_name="Automated Gigafactory Cell Assembly Line",
        defaults={
            'site': 'Nevada Gigafactory Bay C',
            'status': 'IN_PROGRESS',
            'progress_percentage': 85,
            'budget': 8200000.00,
            'start_date': timezone.now().date() - timedelta(days=150),
            'end_date': timezone.now().date() + timedelta(days=30),
        }
    )

    # 6. OPERATORS (format: IND-OP-0001, IND-OP-0002)
    op1, _ = Operator.objects.get_or_create(
        user=op1_user,
        defaults={
            'name': op1_user.name,
            'employee_id': 'EMP-4011',
            'department': 'Mechanical Assembly & Hydraulics',
            'project': p1,
            'site': p1.site,
            'shift': 'Morning',
            'status': 'ACTIVE',
        }
    )
    print(f"[+] Operator 1 Created: {op1.operator_id} (David Chen)")

    op2, _ = Operator.objects.get_or_create(
        user=op2_user,
        defaults={
            'name': op2_user.name,
            'employee_id': 'EMP-4012',
            'department': 'Electrical Instrumentation & SCADA',
            'project': p1,
            'site': p1.site,
            'shift': 'Afternoon',
            'status': 'ACTIVE',
        }
    )
    print(f"[+] Operator 2 Created: {op2.operator_id} (Elena Rostova)")

    # 7. TASKS
    Task.objects.get_or_create(
        task_name="Verify Rotor Hub Pre-tensioning Torques",
        project=p1,
        operator=op1,
        defaults={
            'description': 'Apply calibrated hydraulic tensioner to 48 flange studs at 3,200 Nm.',
            'status': 'IN_PROGRESS',
            'priority': 'CRITICAL',
            'assigned_date': timezone.now().date() - timedelta(days=1),
        }
    )

    Task.objects.get_or_create(
        task_name="Ultrasonic Flaw Detection on Gearbox Casing",
        project=p1,
        operator=op1,
        defaults={
            'description': 'Scan casing weld joints for subsurface fissures as per ISO 17640.',
            'status': 'TODO',
            'priority': 'HIGH',
            'assigned_date': timezone.now().date(),
        }
    )

    Task.objects.get_or_create(
        task_name="Main Bearing Grease Purge & Spectrometry Sample",
        project=p1,
        operator=op1,
        defaults={
            'description': 'Flush 15 kg synthetic polyurea grease and bottle sample for lab analysis.',
            'status': 'COMPLETED',
            'priority': 'MEDIUM',
            'assigned_date': timezone.now().date() - timedelta(days=3),
            'completed_date': timezone.now().date() - timedelta(days=1),
        }
    )

    Task.objects.get_or_create(
        task_name="Calibrate 33kV Switchgear SF6 Pressure Sensors",
        project=p1,
        operator=op2,
        defaults={
            'description': 'Pressure transducer verification at 6.2 bar operating setpoint.',
            'status': 'IN_PROGRESS',
            'priority': 'HIGH',
            'assigned_date': timezone.now().date(),
        }
    )

    # 8. ACTIVITY RECORDS (Daily Production / Operations)
    ActivityRecord.objects.get_or_create(
        activity="Precision Flange Bolting & Hydraulic Sealing",
        project=p1,
        operator=op1,
        date=timezone.now().date() - timedelta(days=1),
        defaults={
            'quantity': 48.0,
            'unit': 'Studs Torqued',
            'status': 'APPROVED',
            'approved_by': admin_user,
            'remarks': 'Torque logs within +/- 1.2% allowable tolerance. Verified by QC.',
        }
    )

    ActivityRecord.objects.get_or_create(
        activity="Cooling Loop Pressure Leakage Integrity Test",
        project=p1,
        operator=op1,
        date=timezone.now().date(),
        defaults={
            'quantity': 18.5,
            'unit': 'Bar Constant Pressure',
            'status': 'PENDING',
            'remarks': 'Holding 18.5 bar over 4-hour cycle. Awaiting supervisor signoff.',
        }
    )

    ActivityRecord.objects.get_or_create(
        activity="Fiber Optic SCADA Harness Termination",
        project=p1,
        operator=op2,
        date=timezone.now().date(),
        defaults={
            'quantity': 24.0,
            'unit': 'Terminations',
            'status': 'PENDING',
            'remarks': 'Completed primary fiber bundle fusion splicing.',
        }
    )

    # 9. PROJECT DOCUMENTS
    ProjectDocument.objects.get_or_create(
        title="Turbine Nacelle Structural Blueprint Rev-D",
        project=p1,
        defaults={
            'document_type': 'Blueprint',
            'file_url': '/documents/titan-nacelle-revD.pdf',
            'is_approved_for_client': True,
        }
    )

    ProjectDocument.objects.get_or_create(
        title="Q3 Independent Environmental & Noise Compliance Audit",
        project=p1,
        defaults={
            'document_type': 'Safety',
            'file_url': '/documents/environmental-audit-q3.pdf',
            'is_approved_for_client': True,
        }
    )

    ProjectDocument.objects.get_or_create(
        title="Monthly Milestone Execution Status Report #04",
        project=p1,
        defaults={
            'document_type': 'Progress',
            'file_url': '/documents/progress-report-04.pdf',
            'is_approved_for_client': True,
        }
    )

    # 10. ATTENDANCE
    AttendanceRecord.objects.get_or_create(
        operator=op1,
        date=timezone.now().date(),
        defaults={
            'shift': op1.shift,
            'status': 'PRESENT',
            'check_in_time': '05:52:00'
        }
    )

    AttendanceRecord.objects.get_or_create(
        operator=op2,
        date=timezone.now().date(),
        defaults={
            'shift': op2.shift,
            'status': 'PRESENT',
            'check_in_time': '13:48:00'
        }
    )

    # 11. AUDIT LOGS
    AuditLog.objects.create(
        user=admin_user,
        user_email=admin_user.email,
        role='ADMIN',
        action='SYSTEM_INITIALIZED',
        target='RBAC Industrial Engine',
        ip_address='127.0.0.1'
    )

    AuditLog.objects.create(
        user=admin_user,
        user_email=admin_user.email,
        role='ADMIN',
        action='OPERATOR_ASSIGNED_PROJECT',
        target=f'{op1.operator_id} -> {p1.project_name}',
        ip_address='127.0.0.1'
    )

    print("\n[OK] Database seeding completed successfully!")
    print("Sample users were created only when absent; existing users and passwords were left unchanged.")

if __name__ == '__main__':
    run_seed()
