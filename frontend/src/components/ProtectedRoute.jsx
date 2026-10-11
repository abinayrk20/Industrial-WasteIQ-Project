import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { securityApi } from '../services/api';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, getDashboardPath } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Log blocked attempt to backend audit log
      securityApi.logAccessDenied(location.pathname);
    }
  }, [user, allowedRoles, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account Status Check
  if (user.status !== 'ACTIVE') {
    return <Navigate to="/access-denied" state={{ reason: 'DEACTIVATED' }} replace />;
  }

  // Strict Role Check
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/access-denied"
        state={{
          attemptedPath: location.pathname,
          requiredRoles: allowedRoles,
          userRole: user.role,
          redirectPath: getDashboardPath(user.role)
        }}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
