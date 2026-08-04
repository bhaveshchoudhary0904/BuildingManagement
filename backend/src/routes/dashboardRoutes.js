const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboard,
  getDashboardAnalytics,
} = require("../controllers/dashboardController");

router.get("/", authMiddleware, getDashboard);

router.get("/analytics", authMiddleware, getDashboardAnalytics);

module.exports = router;