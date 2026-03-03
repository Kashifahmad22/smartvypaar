const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getFinancialSummary
} = require("../controllers/financialAnalyticsController");

router.get("/financial-summary", protect, getFinancialSummary);

module.exports = router;