from django.contrib import admin
from django.urls import path, re_path, include
from django.http import HttpResponse
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DIST_INDEX = BASE_DIR.parent / 'frontend' / 'dist' / 'index.html'

def serve_react(request):
    try:
        with open(DIST_INDEX, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read(), content_type='text/html')
    except Exception as e:
        return HttpResponse(
            f"<h3>Frontend build not found.</h3><p>Run <code>npm run build</code> in the frontend folder.</p><p>{e}</p>",
            status=500
        )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    re_path(r'^(?!api/|admin/|assets/|static/).*$', serve_react, name='react_spa'),
]
