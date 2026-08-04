import api from './api';

const residentService = {
  getResidents: () => api.get('/residents'),
  getResident: (id) => api.get(`/residents/${id}`),
  updateResident: (id, data) => api.put(`/residents/${id}`, data),
  deleteResident: (id) => api.delete(`/residents/${id}`),
  createResident: (data) => api.post('/residents', data),
};

export default residentService;
