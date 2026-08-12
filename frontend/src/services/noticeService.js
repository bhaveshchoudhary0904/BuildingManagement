import api from './api';

const noticeService = {
  getNotices: () => api.get('/api/notices'),
  getNotice: (id) => api.get(`/api/notices/${id}`),
  createNotice: (data) => api.post('/api/notices', data),
  updateNotice: (id, data) => api.put(`/api/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/api/notices/${id}`),
};

export default noticeService;
