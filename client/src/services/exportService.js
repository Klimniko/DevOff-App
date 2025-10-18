import api from './api';

const downloadBlob = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

const exportService = {
  async exportCalculation(id, format) {
    const response = await api.get(`/export/${format}/${id}`, { responseType: 'blob' });
    downloadBlob(response.data, `calculation-${id}.${format === 'excel' ? 'xlsx' : format}`, response.headers['content-type']);
  },
  async bulkExport(ids, format) {
    const response = await api.post('/export/bulk', { ids, format }, { responseType: 'blob' });
    downloadBlob(response.data, `calculations.${format === 'excel' ? 'xlsx' : format}`, response.headers['content-type']);
  }
};

export default exportService;
