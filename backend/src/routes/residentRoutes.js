const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getResidents,
  getResidentByUserId,
  getResidentDashboard,
  createResident,
  deleteResident,
} = require("../controllers/residentController");

// GET /api/residents (protected)
router.get("/", authMiddleware, getResidents);

// GET /api/residents/user/:userId (protected)
router.get("/user/:userId", authMiddleware, getResidentByUserId);

// GET /api/residents/dashboard (protected)
router.get("/dashboard", authMiddleware, getResidentDashboard);

// POST /api/residents (protected - admin only)
router.post("/", authMiddleware, createResident);

// DELETE /api/residents/:id (protected - admin only)
router.delete("/:id", authMiddleware, deleteResident);

module.exports = router;