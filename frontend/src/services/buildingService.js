import api from './api';

const buildingService = {
  getBuildings: () => api.get('/api/buildings'),
  getBuilding: (id) => api.get(`/api/buildings/${id}`),
  createBuilding: (data) => api.post('/api/buildings', data),
  updateBuilding: (id, data) => api.put(`/api/buildings/${id}`, data),
  deleteBuilding: (id) => api.delete(`/api/buildings/${id}`),
};

export default buildingService;
