import api from './api';

const currencyService = {
  async getRate() {
    const response = await api.get('/currency/rates');
    return response.data;
  },
  async refresh() {
    const response = await api.get('/currency/refresh');
    return response.data;
  }
};

export default currencyService;
