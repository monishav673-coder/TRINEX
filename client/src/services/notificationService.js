import api from './api';

export const notificationService = {
  getAll: async () => {
    return await api.get('/notifications');
  },

  markRead: async (id) => {
    return await api.put(`/notifications/${id}/read`);
  },

  markAllRead: async () => {
    return await api.put('/notifications/mark-all-read');
  }
};

export default notificationService;
