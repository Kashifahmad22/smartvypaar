const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  getFinancialSummary
} = require("../controllers/financeController");

router.get("/summary", protect, getFinancialSummary);

module.exports = router;