import api from './api';

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

export default documentService;
