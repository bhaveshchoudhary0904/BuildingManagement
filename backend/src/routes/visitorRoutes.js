const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getVisitors,
  getVisitor,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  checkInVisitor,
  checkOutVisitor,
  getVisitorsByResidentId
} = require('../controllers/visitorController');

router.get('/', authMiddleware, getVisitors);
router.get('/:id', authMiddleware, getVisitor);
router.post('/', authMiddleware, createVisitor);
router.put('/:id', authMiddleware, updateVisitor);
router.delete('/:id', authMiddleware, deleteVisitor);
router.post('/:id/check-in', authMiddleware, checkInVisitor);
router.post('/:id/check-out', authMiddleware, checkOutVisitor);
router.get('/resident/:residentId', authMiddleware, getVisitorsByResidentId);

module.exports = router;
