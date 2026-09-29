import api from './api';

export const officerService = {
  getDashboard: async () => {
    return await api.get('/officer/dashboard');
  },

  getReviews: async () => {
    return await api.get('/officer/reviews');
  },

  takeReviewAction: async (applicationId, data) => {
    return await api.post(`/officer/reviews/${applicationId}`, data);
  },

  getBeneficiaries: async () => {
    return await api.get('/officer/beneficiaries');
  },

  getAuditLogs: async () => {
    return await api.get('/audit-logs');
  }
};

export default officerService;
