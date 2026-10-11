import os
import django
from datetime import timedelta
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

def run_seed():
    print("[*] Starting Industrial Project Management RBAC Seeder...")

    # 1. ADMIN USER
    admin_user, created = User.objects.get_or_create(email='admin@industrial.com')
    admin_user.username = 'admin'
    admin_user.name = 'Marcus Vance (Executive Director)'
    admin_user.role = 'ADMIN'
    admin_user.status = 'ACTIVE'
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.set_password('Admin@12345')
    admin_user.save()
    print("[+] Admin User: admin@industrial.com / Admin@12345")

    # 2. CLIENT VIEWER USER
    client_user, created = User.objects.get_or_create(email='client@industrial.com')
    client_user.username = 'client'
    client_user.name = 'Apex Global Energy Ltd. (Client Representative)'
    client_user.role = 'CLIENT_VIEWER'
    client_user.status = 'ACTIVE'
    client_user.set_password('Client@12345')
    client_user.save()
    print("[+] Client Viewer User: client@industrial.com / Client@12345")

    # 3. OPERATOR USER 1
    op1_user, created = User.objects.get_or_create(email='operator01@industrial.com')
    op1_user.username = 'operator01'
    op1_user.name = 'David Chen'
    op1_user.role = 'OPERATOR'
    op1_user.status = 'ACTIVE'
    op1_user.set_password('Operator@12345')
    op1_user.save()

    # 4. OPERATOR USER 2
    op2_user, created = User.objects.get_or_create(email='operator02@industrial.com')
    op2_user.username = 'operator02'
    op2_user.name = 'Elena Rostova'
    op2_user.role = 'OPERATOR'
    op2_user.status = 'ACTIVE'
    op2_user.set_password('Operator@12345')
    op2_user.save()

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
    print("---------------------------------------------------------------")
    print("DEMO CREDENTIALS:")
    print("  ADMIN:         admin@industrial.com        / Admin@12345")
    print("  OPERATOR:      operator01@industrial.com   / Operator@12345")
    print("  OPERATOR 2:    operator02@industrial.com   / Operator@12345")
    print("  CLIENT VIEWER: client@industrial.com       / Client@12345")
    print("---------------------------------------------------------------")

if __name__ == '__main__':
    run_seed()
