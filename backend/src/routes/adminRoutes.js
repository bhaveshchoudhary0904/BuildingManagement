const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { buildingAccessMiddleware } = require("../middleware/buildingAccessMiddleware");

const {
  getResidents,
} = require("../controllers/residentController");

// GET /api/admin/residents
router.get("/residents", authMiddleware, buildingAccessMiddleware, getResidents);

module.exports = router;
