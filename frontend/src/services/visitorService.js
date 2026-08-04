import api from './api';

const visitorService = {
  getVisitors: () => api.get('/visitors'),
  getVisitor: (id) => api.get(`/visitors/${id}`),
  createVisitor: (data) => api.post('/visitors', data),
  updateVisitor: (id, data) => api.put(`/visitors/${id}`, data),
  deleteVisitor: (id) => api.delete(`/visitors/${id}`),
};

export default visitorService;
