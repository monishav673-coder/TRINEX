import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('trinex_token');
      const cachedUser = localStorage.getItem('trinex_user');

      if (token && cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('trinex_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('[Auth Check Error]', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier, password, role) => {
    const res = await authService.login({ identifier, password, role });
    if (res.success && res.token) {
      localStorage.setItem('trinex_token', res.token);
      localStorage.setItem('trinex_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const register = async (studentData) => {
    return await authService.register(studentData);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem('trinex_token');
      localStorage.removeItem('trinex_user');
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('trinex_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      isAuthenticated: !!user,
      isStudent: user?.role === 'student',
      isOfficer: user?.role === 'officer' || user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
