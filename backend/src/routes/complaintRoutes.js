const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { 
  getComplaints, 
  getComplaintsByResidentId,
  createComplaint,
  updateComplaint,
  deleteComplaint
} = require("../controllers/complaintController");

// Get complaints (protected)
router.get("/", authMiddleware, getComplaints);
router.get("/resident/:residentId", authMiddleware, getComplaintsByResidentId);

// Create complaint (protected)
router.post("/", authMiddleware, createComplaint);

// Update complaint (protected)
router.put("/:id", authMiddleware, updateComplaint);

// Delete complaint (protected)
router.delete("/:id", authMiddleware, deleteComplaint);

module.exports = router;
