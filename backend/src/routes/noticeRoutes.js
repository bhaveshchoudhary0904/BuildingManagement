const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

router.get('/', authMiddleware, getNotices);
router.get('/:id', authMiddleware, getNotice);
router.post('/', authMiddleware, createNotice);
router.put('/:id', authMiddleware, updateNotice);
router.delete('/:id', authMiddleware, deleteNotice);

module.exports = router;
