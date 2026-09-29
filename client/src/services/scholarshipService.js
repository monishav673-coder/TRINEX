import api from './api';

export const scholarshipService = {
  getAll: async (params) => {
    return await api.get('/scholarships', { params });
  },

  getById: async (id) => {
    return await api.get(`/scholarships/${id}`);
  },

  checkEligibility: async (formData) => {
    return await api.post('/eligibility/check', formData);
  }
};

export default scholarshipService;
