import api from './api';

const visitorService = {
  getVisitors: () => api.get('/api/visitors'),
  getVisitor: (id) => api.get(`/api/visitors/${id}`),
  createVisitor: (data) => api.post('/api/visitors', data),
  updateVisitor: (id, data) => api.put(`/api/visitors/${id}`, data),
  deleteVisitor: (id) => api.delete(`/api/visitors/${id}`),
};

export default visitorService;
