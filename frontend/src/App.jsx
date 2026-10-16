import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
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
    <div className="relative min-h-screen bg-[#030806] text-[#F4FFF7] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Futuristic Industrial WasteIQ 3D Eco-Tech Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/industrial-wasteiq-hero.jpg"
          alt="Industrial WasteIQ Eco-Tech Background"
          className="w-full h-full object-cover object-center filter brightness-[0.3] contrast-125"
        />
        {/* Dark Obsidian Gradient Vignette for perfect text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030806]/90 via-[#030806]/80 to-[#030806]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(#39FF78_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="relative z-10 min-h-screen">
        <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
      </div>
    </div>
  );
}

export default App;
