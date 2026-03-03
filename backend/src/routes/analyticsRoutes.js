const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getTopProducts,
  getWeeklyProfit,
  getBusinessHealth,
  getMonthlySummary,
  getUnifiedSummary ,  // ✅ ADD THIS
  getTrendAnalytics
} = require("../controllers/analyticsController");

// ===============================
// EXISTING ROUTES (KEEP FOR NOW)
// ===============================
router.get("/dashboard", protect, getDashboardStats);
router.get("/top-products", protect, getTopProducts);
router.get("/weekly-profit", protect, getWeeklyProfit);
router.get("/business-health", protect, getBusinessHealth);
router.get("/monthly-summary", protect, getMonthlySummary);
router.get("/trend", protect, getTrendAnalytics);


// ===============================
// 🔥 NEW UNIFIED ENGINE
// ===============================
router.get("/summary", protect, getUnifiedSummary);

module.exports = router;