const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getAllBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getDeveloperDashboard,
} = require("../controllers/developerController");

// All developer routes require authentication and developer role
router.use(authMiddleware, roleMiddleware(["DEVELOPER"]));

// Building management
router.get("/buildings", getAllBuildings);
router.post("/buildings", createBuilding);
router.put("/buildings/:id", updateBuilding);
router.delete("/buildings/:id", deleteBuilding);

// Admin management
router.post("/admins", createAdmin);
router.get("/admins", getAllAdmins);
router.put("/admins/:id", updateAdmin);
router.delete("/admins/:id", deleteAdmin);

// Dashboard
router.get("/dashboard", getDeveloperDashboard);

module.exports = router;
