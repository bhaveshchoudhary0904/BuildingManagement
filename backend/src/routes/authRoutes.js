const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const authController = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/me", authMiddleware, authController.me);

router.post("/logout", authMiddleware, authController.logout);

router.put("/profile", authMiddleware, upload.single("profile_image"), authController.updateProfile);

router.put("/email", authMiddleware, authController.updateEmail);

router.put("/phone", authMiddleware, authController.updatePhone);

router.put("/password", authMiddleware, authController.changePassword);

// Password reset endpoints (no auth required)
router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

module.exports = router;