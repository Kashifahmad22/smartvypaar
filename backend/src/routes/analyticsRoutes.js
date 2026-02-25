const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getTopProducts,
  getWeeklyProfit,
  getBusinessHealth,
  getMonthlySummary   // 🔥 NEW
} = require("../controllers/analyticsController");

// Existing routes
router.get("/dashboard", protect, getDashboardStats);
router.get("/top-products", protect, getTopProducts);
router.get("/weekly-profit", protect, getWeeklyProfit);
router.get("/business-health", protect, getBusinessHealth);

// 🔥 NEW Monthly Summary Route
router.get("/monthly-summary", protect, getMonthlySummary);

module.exports = router;