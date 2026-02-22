const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getTopProducts,
  getWeeklyProfit,
  getBusinessHealth
} = require("../controllers/analyticsController");

router.get("/dashboard", protect, getDashboardStats);
router.get("/top-products", protect, getTopProducts);
router.get("/weekly-profit", protect, getWeeklyProfit);
router.get("/business-health", protect, getBusinessHealth);

module.exports = router;