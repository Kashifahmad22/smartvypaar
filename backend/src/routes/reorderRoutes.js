const express = require("express");
const { getReorderRecommendations } = require("../controllers/reorderController");
const {
  getVelocityClassification 
} = require("../controllers/reorderController");

const protect = require("../middleware/authMiddleware");


const router = express.Router();

router.get("/recommendations", protect, getReorderRecommendations);
router.get("/velocity", protect, getVelocityClassification);
module.exports = router;