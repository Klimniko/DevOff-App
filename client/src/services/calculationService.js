import api from './api';

const calculationService = {
  async list(params) {
    const response = await api.get('/calculations', { params });
    return response.data;
  },
  async get(id) {
    const response = await api.get(`/calculations/${id}`);
    return response.data;
  },
  async create(payload) {
    const response = await api.post('/calculations', payload);
    return response.data;
  },
  async update(id, payload) {
    const response = await api.put(`/calculations/${id}`, payload);
    return response.data;
  },
  async remove(id) {
    const response = await api.delete(`/calculations/${id}`);
    return response.data;
  }
};

export default calculationService;
