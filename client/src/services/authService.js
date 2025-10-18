import api from './api';

const authService = {
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  async verify() {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

export default authService;
