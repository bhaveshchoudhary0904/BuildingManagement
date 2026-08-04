import api from './api';

const settingService = {
  getSettings: () => api.get('/settings'),
  getSetting: (key) => api.get(`/settings/${key}`),
  updateSetting: (key, data) => api.put(`/settings/${key}`, data),
  updateSettings: (data) => api.put('/settings', data),
};

export default settingService;
