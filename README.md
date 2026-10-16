# Secure Industrial Project Management System (RBAC)

A mission-critical Industrial Project Management System engineered with strict **Role-Based Access Control (RBAC)** across three isolated user tiers: **ADMIN**, **OPERATOR**, and **CLIENT_VIEWER**.

---

## 🛡️ Architecture & Security Model

### 1. Three Strict User Roles

| Role | Clearance Level | Primary Responsibilities | Strict Restrictions |
| :--- | :--- | :--- | :--- |
| **ADMIN** | **Tier 1 (Highest)** | • Full operational control<br>• Create & manage Operators with auto-generated IDs (`IND-OP-XXXX`)<br>• Project & shift assignment<br>• Review & approve/reject activity records<br>• System configuration & inspection of immutable audit logs | • Passwords and sensitive secrets are never returned in responses |
| **OPERATOR** | **Tier 2 (Operational)** | • Access assigned project & shift work orders<br>• Update task progression (`PENDING` → `IN_PROGRESS` → `COMPLETED`)<br>• Submit daily production/activity logs<br>• Report site issues | • Cannot access admin panels or settings<br>• Cannot view other operators' records or clients<br>• Cannot create/delete accounts or modify permissions |
| **CLIENT_VIEWER** | **Tier 3 (View-Only)** | • High-level executive dashboard<br>• View approved progress percentages & milestone tracking<br>• View approved production summary reports<br>• View client-approved blueprints & documentation | • **Strictly Read-Only** at the backend/database/API level (`IsClientReadOnly`)<br>• All `POST`, `PUT`, `PATCH`, `DELETE` operations blocked with HTTP 403<br>• Cannot view unapproved records or operator shift internals |

---

## 🔒 Multi-Layer Security Invariant

1. **Backend Permission Checks**:
   - `IsAdminRole`: Grants full read/write management.
   - `IsOperatorRole`: Enforces object-level filtering (`operator = request.user.operator_profile`).
   - `IsClientReadOnly`: Rejects non-safe HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`) with HTTP 403 Forbidden.
2. **Sequential Unique Operator ID Generator**:
   - Automatic allocation formatted as `IND-OP-0001`, `IND-OP-0002`, `IND-OP-0003`...
   - Atomically calculated using regex extraction to prevent race conditions or collisions.
3. **Automated Audit Logging**:
   - Every login, operator account creation, record approval/rejection, and unauthorized access attempt is immutably recorded in the `AuditLog` table with user email, role, action, target, IP address, and timestamp.
4. **Route Guard & Security Interception**:
   - Frontend `ProtectedRoute` validates role authorization before rendering.
   - Unauthorized attempts immediately post to `/api/security/log-access-denied/`, record an audit entry, and redirect the user to the dedicated `/access-denied` page before restoring them to their authorized dashboard.

---

## 🔑 Demo Access Credentials

The database has been pre-seeded with active operational data:

| Role | Email | Password | Identifier / Site |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@industrial.com` | `Admin@12345` | Master Operations Console |
| **OPERATOR 1** | `operator01@industrial.com` | `Operator@12345` | `IND-OP-0001` (David Chen) &bull; Offshore Turbine Array |
| **OPERATOR 2** | `operator02@industrial.com` | `Operator@12345` | `IND-OP-0002` (Elena Rostova) &bull; Bio-Polymer Plant |
| **CLIENT VIEWER** | `client@industrial.com` | `Client@12345` | Apex Global Energy Ltd. &bull; Stakeholder Portal |

---

## 🚀 Running the Project

### Backend (Django 5 + Django REST Framework + SimpleJWT)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python seed_data.py   # Seeds users, operators, projects, tasks, audit logs
python manage.py runserver 127.0.0.1:8000
```

### Connecting the backend to Supabase

The Django backend connects to the Supabase **PostgreSQL database** using its
database connection URI, not the frontend's Supabase publishable key. In the
Supabase dashboard, copy the database URI from **Connect**, then set it as
`DATABASE_URL` in `backend/.env` for local development or in the backend
hosting provider's environment variables for deployment. Use a direct or
session-pooler URI supported by your hosting network; the backend requires SSL.
Keep the database password private and do not commit `.env`.

When `DATABASE_URL` is configured, run `python manage.py migrate` from
`backend` to create the Django tables in Supabase. To populate a new database
with the demo users and sample data, run `python seed_data.py` once. Without
`DATABASE_URL`, local development continues to use `backend/db.sqlite3`.

### Frontend (React + Vite + Tailwind CSS + Lucide Icons + Recharts)
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Frontend Portal**: `http://127.0.0.1:5173/`
- **Backend API**: `http://127.0.0.1:8000/api/`

### Deploying the frontend to Vercel

For this repository layout, set Vercel's **Root Directory** to
`Industrial-Project-Management/frontend`, with the build command `npm run build`
and output directory `dist`. The `frontend/vercel.json` rewrite sends direct
requests for client-side routes back to `index.html`, where React Router can
render the requested page.

Vercel deploys this frontend separately from Django. The frontend currently
requests the API at `/api`, so deploy/configure the Django backend at that same
origin or provide a proxy to it; the SPA rewrite is not an API deployment.

---

## 🧪 Automated RBAC Test Suite
Run the comprehensive test suite verifying all 3 user roles, permission restrictions, and audit logging:
```bash
cd backend
python ..\..\brain\<conversation-id>\scratch\test_rbac_e2e.py
```
Outputs complete status logs verifying 100% RBAC policy adherence across all endpoints.
