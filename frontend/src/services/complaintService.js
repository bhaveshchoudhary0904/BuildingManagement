import api from './api';

const complaintService = {
  getComplaints: () => api.get('/complaints'),
  getComplaint: (id) => api.get(`/complaints/${id}`),
  createComplaint: (data) => api.post('/complaints', data),
  updateComplaint: (id, data) => api.put(`/complaints/${id}`, data),
  deleteComplaint: (id) => api.delete(`/complaints/${id}`),
};

export default complaintService;
