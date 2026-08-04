const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMaintenanceRequests,
  getMaintenanceRequest,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  deleteMaintenanceRequest
} = require('../controllers/maintenanceController');

router.get('/', authMiddleware, getMaintenanceRequests);
router.get('/:id', authMiddleware, getMaintenanceRequest);
router.post('/', authMiddleware, createMaintenanceRequest);
router.put('/:id', authMiddleware, updateMaintenanceRequest);
router.delete('/:id', authMiddleware, deleteMaintenanceRequest);

module.exports = router;
