import axios from 'axios';

// Render backend URL from .env; local development uses Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_profile');
      localStorage.removeItem('user_role');

      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// AUTH APIS
export const authApi = {
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

// ADMIN APIS
export const adminApi = {
  getDashboard: async () => (await api.get('/admin/dashboard/')).data,
  getOperators: async () => (await api.get('/admin/operators/')).data,
  createOperator: async (data) => (await api.post('/admin/operators/', data)).data,
  updateOperator: async (id, data) => (await api.patch(`/admin/operators/${id}/`, data)).data,
  getProjects: async () => (await api.get('/admin/projects/')).data,
  createProject: async (data) => (await api.post('/admin/projects/', data)).data,
  updateProject: async (id, data) => (await api.patch(`/admin/projects/${id}/`, data)).data,
  approveActivity: async (id, action, remarks = '') =>
    (await api.post(`/admin/activities/${id}/approve/`, { action, remarks })).data,
  getAuditLogs: async () => (await api.get('/admin/audit-logs/')).data,
};

// OPERATOR APIS
export const operatorApi = {
  getDashboard: async () => (await api.get('/operator/dashboard/')).data,
  getTasks: async () => (await api.get('/operator/tasks/')).data,
  updateTaskStatus: async (taskId, status) =>
    (await api.patch(`/operator/tasks/${taskId}/status/`, { status })).data,
  getRecords: async () => (await api.get('/operator/records/')).data,
  submitRecord: async (data) => (await api.post('/operator/records/', data)).data,
};

// CLIENT APIS (READ-ONLY)
export const clientApi = {
  getDashboard: async () => (await api.get('/client/dashboard/')).data,
  getReports: async () => (await api.get('/client/reports/')).data,
  getDocuments: async () => (await api.get('/client/documents/')).data,
};

// SECURITY LOGGING API
export const securityApi = {
  logAccessDenied: async (attemptedPath) => {
    try {
      await api.post('/security/log-access-denied/', {
        attempted_path: attemptedPath,
      });
    } catch (error) {
      // Best-effort logging
    }
  },
};

export default api;