import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('user_profile');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      authApi.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('user_profile', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.clear();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (userIdOrEmail, password) => {
    const data = await authApi.login(userIdOrEmail, password);
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user_profile', JSON.stringify(data.user));
    localStorage.setItem('user_role', data.user.role);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    return await authApi.register(userData);
  };

  const forgotPassword = async (userIdOrEmail, newPassword) => {
    return await authApi.forgotPassword(userIdOrEmail, newPassword);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const getDashboardPath = (role) => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'OPERATOR') return '/operator/dashboard';
    if (role === 'CLIENT_VIEWER' || role === 'CLIENT') return '/client/dashboard';
    return '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, forgotPassword, getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
