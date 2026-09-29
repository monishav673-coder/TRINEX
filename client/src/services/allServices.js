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

export const documentService = {
  getAll: async (studentId) => {
    return await api.get('/documents', { params: { studentId } });
  },

  upload: async (formData) => {
    return await api.post('/documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  delete: async (id) => {
    return await api.delete(`/documents/${id}`);
  },

  syncDigiLocker: async () => {
    return await api.post('/documents/digilocker-sync');
  }
};

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

export const paymentService = {
  getAll: async () => {
    return await api.get('/payments');
  }
};

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

export const jagoService = {
  sendMessage: async (message) => {
    return await api.post('/jago/chat', { message });
  }
};

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
