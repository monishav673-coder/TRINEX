import api from './api';

export const jagoService = {
  sendMessage: async (message) => {
    return await api.post('/jago/chat', { message });
  }
};

export default jagoService;
