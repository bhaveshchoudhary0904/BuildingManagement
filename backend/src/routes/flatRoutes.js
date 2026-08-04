const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { getFlats, createFlat } = require("../controllers/flatController");

router.get("/", authMiddleware, getFlats);
router.post("/", authMiddleware, createFlat);

module.exports = router;
