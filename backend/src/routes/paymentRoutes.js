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
  createBillForResident,
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  getPaymentBreakdown,
  updateBuildingMCSConfig,
  calculateChargesPreview,
  applyLatePaymentInterest
} = require('../controllers/paymentController');

router.get('/', authMiddleware, getPayments);
router.post('/', authMiddleware, createPayment);
router.get('/resident/:residentId', authMiddleware, getPaymentsByResidentId);

// QR code generation (protected)
router.get('/:paymentId/qr', authMiddleware, generatePaymentQR);

// Confirm payment (protected)
router.post('/:paymentId/confirm', authMiddleware, confirmPayment);

// Get payment charge breakdown (protected)
router.get('/:paymentId/breakdown', authMiddleware, getPaymentBreakdown);

// Create maintenance bill for logged-in resident (protected)
router.post('/bill/create', authMiddleware, createMaintenanceBill);

// Create maintenance bill for any resident (admin function, protected)
router.post('/bill/create-for-resident', authMiddleware, createBillForResident);

// Calculate charges preview (protected)
router.post('/calculate-preview', authMiddleware, calculateChargesPreview);

// Update building MCS configuration (admin function, protected)
router.put('/building/:building_id/mcs-config', authMiddleware, updateBuildingMCSConfig);

// Apply late payment interest (admin function, protected)
router.post('/:paymentId/apply-late-interest', authMiddleware, applyLatePaymentInterest);

// Razorpay integration (protected)
router.post('/create-order', authMiddleware, createRazorpayOrder);
router.post('/verify', authMiddleware, verifyRazorpayPayment);

// Razorpay webhook (no auth required - called by Razorpay)
router.post('/webhook', handleRazorpayWebhook);

module.exports = router;
