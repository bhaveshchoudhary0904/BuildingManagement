const express = require('express');
const router = express.Router();
const {
  getSettings,
  getSetting,
  updateSetting,
  updateSettings
} = require('../controllers/settingController');

router.get('/', getSettings);
router.get('/:key', getSetting);
router.put('/:key', updateSetting);
router.put('/', updateSettings);

module.exports = router;
