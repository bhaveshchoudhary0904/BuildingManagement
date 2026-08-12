import api from './api';

const residentService = {
  getResidents: () => api.get('/api/residents'),
  getResident: (id) => api.get(`/api/residents/${id}`),
  updateResident: (id, data) => api.put(`/api/residents/${id}`, data),
  deleteResident: (id) => api.delete(`/api/residents/${id}`),
  createResident: (data) => api.post('/api/residents', data),
};

export default residentService;
