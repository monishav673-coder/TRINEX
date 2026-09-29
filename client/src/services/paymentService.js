import api from './api';

export const paymentService = {
  getAll: async () => {
    return await api.get('/payments');
  }
};

export default paymentService;
