const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

/* ===========================
   PROFILE ROUTES
=========================== */

// GET Profile
router.get("/", authMiddleware, getProfile);

// UPDATE Profile
router.put("/", authMiddleware, updateProfile);

module.exports = router;