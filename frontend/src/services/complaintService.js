import api from './api';

const complaintService = {
  getComplaints: () => api.get('/api/complaints'),
  getComplaint: (id) => api.get(`/api/complaints/${id}`),
  createComplaint: (data) => api.post('/api/complaints', data),
  updateComplaint: (id, data) => api.put(`/api/complaints/${id}`, data),
  deleteComplaint: (id) => api.delete(`/api/complaints/${id}`),
};

export default complaintService;
