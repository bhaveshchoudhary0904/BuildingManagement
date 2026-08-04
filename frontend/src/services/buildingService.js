import api from './api';

const buildingService = {
  getBuildings: () => api.get('/buildings'),
  getBuilding: (id) => api.get(`/buildings/${id}`),
  createBuilding: (data) => api.post('/buildings', data),
  updateBuilding: (id, data) => api.put(`/buildings/${id}`, data),
  deleteBuilding: (id) => api.delete(`/buildings/${id}`),
};

export default buildingService;
