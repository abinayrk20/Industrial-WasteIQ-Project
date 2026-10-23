import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, clearAuthData } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken || refreshToken) {
      authApi.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('user_profile', JSON.stringify(userData));
        })
        .catch(() => {
          clearAuthData();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      clearAuthData();
      setLoading(false);
    }
  }, []);

  const login = async (userIdOrEmail, password) => {
    const data = await authApi.login(userIdOrEmail, password);
    const allowedRoles = ['ADMIN', 'OPERATOR', 'CLIENT_VIEWER'];
    if (!data?.access || !data?.refresh || !data?.user || !allowedRoles.includes(data.user.role)) {
      throw new Error('The login service returned an incomplete or unsupported user session.');
    }

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
    clearAuthData();
    setUser(null);
    window.location.assign('/login');
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
