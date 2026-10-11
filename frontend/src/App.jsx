import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import AccessDenied from './pages/AccessDenied';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOperators from './pages/admin/AdminOperators';
import AdminProjects from './pages/admin/AdminProjects';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Operator Pages
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorTasks from './pages/operator/OperatorTasks';
import OperatorRecords from './pages/operator/OperatorRecords';
import OperatorReports from './pages/operator/OperatorReports';

// Client Viewer Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientReports from './pages/client/ClientReports';
import ClientDocuments from './pages/client/ClientDocuments';

function App() {
  const { user, getDashboardPath } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      {/* ---------------- 1. ADMIN ROUTES ---------------- */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/operators"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminOperators />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminSettings />
          </ProtectedRoute>
        }
      />

      {/* ---------------- 2. OPERATOR ROUTES ---------------- */}
      <Route
        path="/operator/dashboard"
        element={
          <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/tasks"
        element={
          <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
            <OperatorTasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/records"
        element={
          <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
            <OperatorRecords />
          </ProtectedRoute>
        }
      />
      <Route
        path="/operator/reports"
        element={
          <ProtectedRoute allowedRoles={['OPERATOR', 'ADMIN']}>
            <OperatorReports />
          </ProtectedRoute>
        }
      />

      {/* ---------------- 3. CLIENT VIEWER ROUTES (READ-ONLY) ---------------- */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute allowedRoles={['CLIENT_VIEWER', 'ADMIN']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/reports"
        element={
          <ProtectedRoute allowedRoles={['CLIENT_VIEWER', 'ADMIN']}>
            <ClientReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/documents"
        element={
          <ProtectedRoute allowedRoles={['CLIENT_VIEWER', 'ADMIN']}>
            <ClientDocuments />
          </ProtectedRoute>
        }
      />

      {/* Root redirection based on active role */}
      <Route
        path="/"
        element={
          user ? <Navigate to={getDashboardPath(user.role)} replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
