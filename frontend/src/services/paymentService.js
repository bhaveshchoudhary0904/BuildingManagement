import api from './api';

const paymentService = {
  getPayments: () => api.get('/api/payments'),
  getPayment: (id) => api.get(`/api/payments/${id}`),
  createPayment: (data) => api.post('/api/payments', data),
  updatePayment: (id, data) => api.put(`/api/payments/${id}`, data),
  deletePayment: (id) => api.delete(`/api/payments/${id}`),
};

export default paymentService;
