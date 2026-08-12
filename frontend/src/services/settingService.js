import api from './api';

const settingService = {
  getSettings: () => api.get('/api/settings'),
  getSetting: (key) => api.get(`/api/settings/${key}`),
  updateSetting: (key, data) => api.put(`/api/settings/${key}`, data),
  updateSettings: (data) => api.put('/api/settings', data),
};

export default settingService;
