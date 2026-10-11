# 🚀 Deploying to PythonAnywhere (Step-by-Step Guide)

This guide walks you through deploying the **Industrial Project Management System (RBAC)** to PythonAnywhere for free.

---

## 📦 What is already prepared for you:
1. **Frontend Production Build**: Pre-compiled React + Vite bundle in `frontend/dist/`.
2. **Unified Django Engine**: Django is configured with `WhiteNoise` to serve both the React frontend and the REST API from a single host under `https://<your-username>.pythonanywhere.com`.
3. **Database Pre-Seeded**: `db.sqlite3` with admin, operators, client viewer, projects, and tasks is already seeded.
4. **Deployable Zip File**: A complete lightweight package is ready at:
   `C:\Users\Dell\.gemini\antigravity\scratch\Industrial-Project-Management-Deploy.zip` (1.4 MB)

---

## 🛠️ Step 1: Create a Free PythonAnywhere Account
1. Open [https://www.pythonanywhere.com](https://www.pythonanywhere.com).
2. Click **Pricing & signup** -> Select the **Create a Beginner account** (100% Free, no credit card required).
3. Choose your username (e.g. `yourname`). Your live site will be:
   `https://<your-username>.pythonanywhere.com`

---

## 📁 Step 2: Upload the Project Zip
1. On the PythonAnywhere dashboard, click the **Files** tab.
2. In the **Upload a file** box on the right, upload:
   `Industrial-Project-Management-Deploy.zip`
3. Click the **Consoles** tab and start a **Bash** console.
4. Run the following commands in the Bash console:
   ```bash
   unzip Industrial-Project-Management-Deploy.zip
   cd Industrial-Project-Management/backend
   pip install -r requirements.txt
   python manage.py collectstatic --noinput
   ```

---

## 🌐 Step 3: Configure the Web App
1. Go to the **Web** tab on PythonAnywhere.
2. Click **"Add a new web app"**.
3. Choose **Manual configuration** (do NOT pick "Django", pick **Manual configuration** so you can specify your existing project).
4. Select **Python 3.10** or **Python 3.11**.
5. Finish the wizard.

---

## ⚙️ Step 4: Configure Paths & WSGI
On the **Web** tab, configure the following sections:

### 1. Code Section
- **Source code**:
  `/home/<your-username>/Industrial-Project-Management/backend`
- **Working directory**:
  `/home/<your-username>/Industrial-Project-Management/backend`

### 2. WSGI Configuration File
Click on the link for the **WSGI configuration file** (e.g., `/var/www/<your-username>_pythonanywhere_com_wsgi.py`).
Delete everything inside and paste this:

```python
import os
import sys

# Change '<your-username>' to your actual PythonAnywhere username!
path = '/home/<your-username>/Industrial-Project-Management/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```
Click **Save** in the top right.

### 3. Static Files Section
Add these two mappings under **Static files**:

| URL | Directory |
| :--- | :--- |
| `/assets/` | `/home/<your-username>/Industrial-Project-Management/backend/staticfiles/assets` |
| `/static/` | `/home/<your-username>/Industrial-Project-Management/backend/staticfiles` |

---

## 🚀 Step 5: Reload and View Live Site!
1. Scroll to the top of the **Web** tab.
2. Click the big green button: **"Reload <your-username>.pythonanywhere.com"**.
3. Visit your live site:
   👉 **`https://<your-username>.pythonanywhere.com`**

---

## 🔑 Login Accounts (Pre-Seeded)
- **Admin**: `admin@industrial.com` / `Admin@12345`
- **Operator**: `operator01@industrial.com` / `Operator@12345`
- **Client Viewer**: `client@industrial.com` / `Client@12345`
