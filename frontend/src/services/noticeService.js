import api from './api';

const noticeService = {
  getNotices: () => api.get('/notices'),
  getNotice: (id) => api.get(`/notices/${id}`),
  createNotice: (data) => api.post('/notices', data),
  updateNotice: (id, data) => api.put(`/notices/${id}`, data),
  deleteNotice: (id) => api.delete(`/notices/${id}`),
};

export default noticeService;
