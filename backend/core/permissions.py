from rest_framework import permissions

class IsActiveAccount(permissions.BasePermission):
    """
    Blocks access if the user status is INACTIVE or is_active is False.
    """
    message = "Your account has been deactivated. Please contact an administrator."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.status == 'ACTIVE' and request.user.is_active


class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to ADMIN role or superusers.
    """
    message = "Access Denied: Administrative security clearance is required."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return request.user.is_admin() and request.user.status == 'ACTIVE'


class IsOperatorRole(permissions.BasePermission):
    """
    Allows access to OPERATOR role (or Admin for supervision).
    """
    message = "Access Denied: Certified Operator role required."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return (request.user.is_operator() or request.user.is_admin()) and request.user.status == 'ACTIVE'


class IsClientViewerRole(permissions.BasePermission):
    """
    Allows access to CLIENT_VIEWER role (or Admin).
    Strictly enforces READ-ONLY (SAFE_METHODS).
    """
    message = "Access Denied: Client accounts possess strictly read-only authorization."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # If client viewer, allow ONLY read operations
        if request.user.is_client_viewer():
            if request.method not in permissions.SAFE_METHODS:
                return False
            return request.user.status == 'ACTIVE'
            
        return request.user.is_admin() and request.user.status == 'ACTIVE'


class IsClientReadOnly(permissions.BasePermission):
    """
    Guarantees that CLIENT_VIEWER cannot perform write mutations anywhere in the system.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.role == 'CLIENT_VIEWER' and request.method not in permissions.SAFE_METHODS:
            return False
        return True
