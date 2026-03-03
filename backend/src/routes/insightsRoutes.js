const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getSmartInsightsSummary
} = require("../controllers/insightsController");

router.get("/summary", protect, getSmartInsightsSummary);

module.exports = router;