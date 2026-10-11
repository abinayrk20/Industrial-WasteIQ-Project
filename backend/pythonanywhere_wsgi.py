# WSGI Configuration for PythonAnywhere
# Replace '<your-username>' with your actual PythonAnywhere username!

import os
import sys

# Path to your project's backend directory
path = '/home/<your-username>/Industrial-Project-Management/backend'
if path not in sys.path:
    sys.path.append(path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
