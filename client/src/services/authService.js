import api from './api';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  register: async (studentData) => {
    return await api.post('/auth/register', studentData);
  },

  getMe: async () => {
    return await api.get('/auth/me');
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('trinex_token');
      localStorage.removeItem('trinex_user');
    }
  },

  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (data) => {
    return await api.post('/auth/reset-password', data);
  }
};
