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

## Account provisioning

Login uses accounts in the backend's configured database. No production
credentials are included in the frontend or documentation. Existing users are
not created or changed automatically during deployment.

---

## 🚀 Running the Project

### Backend (Django 5 + Django REST Framework + SimpleJWT)
```bash
cd backend
python -m venv venv
venv\Scripts\activate
Copy-Item .env.example .env
pip install -r requirements.txt
python manage.py migrate
python manage.py test core
python manage.py runserver 127.0.0.1:8000
```

Before starting Django, replace the development `SECRET_KEY` placeholder in
`backend/.env` with a random local value. Generate one with
`python -c "import secrets; print(secrets.token_urlsafe(64))"`. Keep `.env`
private; it is ignored by Git.

To populate a development database with sample records, set the four
`SEED_*_PASSWORD` values in `backend/.env` and run `python seed_data.py`.
The seeder only creates sample users that do not already exist and never
changes an existing user's password. It refuses to run in production unless
`SEED_SAMPLE_DATA=true` is deliberately set.

### Connecting the backend to Supabase

The Django backend connects to the Supabase **PostgreSQL database** using its
database connection URI, not the frontend's Supabase publishable key. In the
Supabase dashboard, copy the database URI from **Connect**, then set it as
`DATABASE_URL` in `backend/.env` for local development or in the backend
hosting provider's environment variables for deployment. Use a direct or
session-pooler URI supported by your hosting network; the backend requires SSL.
Keep the database password private and do not commit `.env`.

When `DATABASE_URL` is configured, run `python manage.py migrate` from
`backend` to create or update the Django tables in Supabase. Production refuses
to start without `DATABASE_URL`; SQLite is used only for local development.
Migrations do not delete existing user records.

### Frontend (React + Vite + Tailwind CSS + Lucide Icons + Recharts)
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Frontend Portal**: `http://127.0.0.1:5173/`
- **Backend API**: `http://127.0.0.1:8000/api/`

### Deploying the frontend to Vercel

Set Vercel's **Root Directory** to `frontend`, with the build command
`npm run build` and output directory `dist`. Set the Vercel environment variable
`VITE_API_BASE_URL` to `https://industrial-wasteiq-project.onrender.com/api`
for Production (and Preview if needed), then redeploy. This is a public API URL,
not a secret. The production build also has this URL as its safe default.
The `frontend/vercel.json` rewrite sends direct
requests for client-side routes back to `index.html`, where React Router can
render the requested page.

Vercel deploys this frontend separately from Django. The frontend sends API
requests directly to the Render backend; the SPA rewrite is not an API proxy.

### Render backend environment

In the Render web service, set `DEBUG=false`, a newly generated `SECRET_KEY`,
`DATABASE_URL` to the Supabase PostgreSQL connection URI, and `ALLOWED_HOSTS`
to the Render hostname. Set `CORS_ALLOWED_ORIGINS` and
`CSRF_TRUSTED_ORIGINS` to `https://industrial-waste-iq-project.vercel.app`.
Do not put database credentials or the Django secret in Vercel variables or
frontend files. Deploy the backend, then run `python manage.py migrate` in the
Render Shell before testing login. The login endpoint is
`POST /api/auth/login/`; the current-user endpoint is `GET /api/auth/me/`.

---

## Authentication tests

Run the backend authentication tests from the backend directory:

```bash
python manage.py test core
```
