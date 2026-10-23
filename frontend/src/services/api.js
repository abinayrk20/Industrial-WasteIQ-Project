import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  const fallbackUrl = import.meta.env.PROD
    ? 'https://industrial-wasteiq-project.onrender.com/api'
    : '/api';
  const cleanUrl = (envUrl || fallbackUrl).trim().replace(/\/+$/, '');
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();
const AUTH_STORAGE_KEYS = ['access_token', 'refresh_token', 'user_profile', 'user_role'];
let refreshPromise = null;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const clearAuthData = () => {
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

// Interceptor to inject JWT Bearer Token
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

// Interceptor to handle expired tokens and security denials
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthEndpoint = /\/auth\/(login|refresh)\/?$/.test(request?.url || '');

    if (error.response?.status !== 401 || !request || request._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      clearAuthData();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }

    const accessToken = localStorage.getItem('access_token');
    if (accessToken && request.headers?.Authorization !== `Bearer ${accessToken}`) {
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    }

    request._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = refreshClient
          .post('/auth/refresh/', { refresh: refreshToken })
          .then((response) => {
            const { access, refresh } = response.data;
            if (!access) {
              throw new Error('The token refresh endpoint did not return an access token.');
            }
            localStorage.setItem('access_token', access);
            if (refresh) {
              localStorage.setItem('refresh_token', refresh);
            }
            return access;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newAccessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(request);
    } catch (refreshError) {
      clearAuthData();
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
      return Promise.reject(refreshError);
    }
  }
);

// ----------------- AUTH APIS -----------------
export const authApi = {
  login: async (userIdOrEmail, password) => {
    const response = await api.post('/auth/login/', {
      email: userIdOrEmail,
      password,
    });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  forgotPassword: async (userIdOrEmail, newPassword) => {
    const response = await api.post('/auth/forgot-password/', {
      user_id: userIdOrEmail,
      new_password: newPassword,
    });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },
};

// ----------------- ADMIN APIS -----------------
export const adminApi = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard/');
    return res.data;
  },
  getOperators: async () => {
    const res = await api.get('/admin/operators/');
    return res.data;
  },
  createOperator: async (operatorData) => {
    const res = await api.post('/admin/operators/', operatorData);
    return res.data;
  },
  updateOperator: async (id, data) => {
    const res = await api.patch(`/admin/operators/${id}/`, data);
    return res.data;
  },
  getProjects: async () => {
    const res = await api.get('/admin/projects/');
    return res.data;
  },
  createProject: async (projectData) => {
    const res = await api.post('/admin/projects/', projectData);
    return res.data;
  },
  updateProject: async (id, data) => {
    const res = await api.patch(`/admin/projects/${id}/`, data);
    return res.data;
  },
  approveActivity: async (id, action, remarks = '') => {
    const res = await api.post(`/admin/activities/${id}/approve/`, { action, remarks });
    return res.data;
  },
  getAuditLogs: async () => {
    const res = await api.get('/admin/audit-logs/');
    return res.data;
  },
};

// ----------------- OPERATOR APIS -----------------
export const operatorApi = {
  getDashboard: async () => {
    const res = await api.get('/operator/dashboard/');
    return res.data;
  },
  getTasks: async () => {
    const res = await api.get('/operator/tasks/');
    return res.data;
  },
  updateTaskStatus: async (taskId, status) => {
    const res = await api.patch(`/operator/tasks/${taskId}/status/`, { status });
    return res.data;
  },
  getRecords: async () => {
    const res = await api.get('/operator/records/');
    return res.data;
  },
  submitRecord: async (recordData) => {
    const res = await api.post('/operator/records/', recordData);
    return res.data;
  },
};

// ----------------- CLIENT VIEWER APIS (READ-ONLY) -----------------
export const clientApi = {
  getDashboard: async () => {
    const res = await api.get('/client/dashboard/');
    return res.data;
  },
  getReports: async () => {
    const res = await api.get('/client/reports/');
    return res.data;
  },
  getDocuments: async () => {
    const res = await api.get('/client/documents/');
    return res.data;
  },
};

// ----------------- SECURITY LOGGING API -----------------
export const securityApi = {
  logAccessDenied: async (attemptedPath) => {
    try {
      await api.post('/security/log-access-denied/', { attempted_path: attemptedPath });
    } catch (e) {
      // Best effort log
    }
  },
};

export default api;
