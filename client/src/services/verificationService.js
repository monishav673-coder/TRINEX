import api from './api';

export const verificationService = {
  getOverview: async (applicationId) => {
    return await api.get('/verification/vericore-overview', { params: { applicationId } });
  },

  getByApplication: async (applicationId) => {
    return await api.get(`/verification/${applicationId}`);
  },

  submitClarification: async (recordId, clarificationText) => {
    return await api.post(`/verification/${recordId}/clarification`, { clarificationText });
  }
};

export default verificationService;
