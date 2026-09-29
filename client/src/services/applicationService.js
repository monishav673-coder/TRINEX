import api from './api';

export const applicationService = {
  getAll: async () => {
    return await api.get('/applications');
  },

  getById: async (id) => {
    return await api.get(`/applications/${id}`);
  },

  create: async (data) => {
    return await api.post('/applications', data);
  },

  getTimeline: async (id) => {
    return await api.get(`/applications/${id}/timeline`);
  }
};

export default applicationService;
