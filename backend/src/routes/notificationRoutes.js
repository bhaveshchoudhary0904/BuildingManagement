const express = require('express');
const router = express.Router();
const {
  getNotificationsByUserId,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');

router.get('/user/:userId', getNotificationsByUserId);
router.put('/:id/read', markAsRead);
router.put('/user/:userId/read-all', markAllAsRead);

module.exports = router;
