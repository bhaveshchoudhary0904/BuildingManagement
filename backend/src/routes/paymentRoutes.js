const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getPayments,
  createPayment,
  getPaymentsByResidentId,
  generatePaymentQR,
  confirmPayment,
  createMaintenanceBill,
  createBillForResident
} = require('../controllers/paymentController');

router.get('/', authMiddleware, getPayments);
router.post('/', authMiddleware, createPayment);
router.get('/resident/:residentId', authMiddleware, getPaymentsByResidentId);

// QR code generation (protected)
router.get('/:paymentId/qr', authMiddleware, generatePaymentQR);

// Confirm payment (protected)
router.post('/:paymentId/confirm', authMiddleware, confirmPayment);

// Create maintenance bill for logged-in resident (protected)
router.post('/bill/create', authMiddleware, createMaintenanceBill);

// Create maintenance bill for any resident (admin function, protected)
router.post('/bill/create-for-resident', authMiddleware, createBillForResident);

module.exports = router;
