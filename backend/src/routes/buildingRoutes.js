const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { buildingAccessMiddleware } = require('../middleware/buildingAccessMiddleware');

const {
  getBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding
} = require('../controllers/buildingController');

// Public route for registration (no auth required)
router.get('/public', getBuildings);

// Protected routes for authenticated users
router.get('/', authMiddleware, buildingAccessMiddleware, getBuildings);
router.get('/:id', authMiddleware, buildingAccessMiddleware, getBuilding);

// Developer only routes for building management
router.post('/', authMiddleware, roleMiddleware(['DEVELOPER']), createBuilding);
router.put('/:id', authMiddleware, roleMiddleware(['DEVELOPER']), updateBuilding);
router.delete('/:id', authMiddleware, roleMiddleware(['DEVELOPER']), deleteBuilding);

module.exports = router;