const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getTopProducts,
  getWeeklyProfit
} = require("../controllers/analyticsController");

router.get("/dashboard", getDashboardStats);
router.get("/top-products", getTopProducts);
router.get("/weekly-profit", getWeeklyProfit);

const { getBusinessHealth } = require("../controllers/analyticsController");

router.get("/business-health", getBusinessHealth);

module.exports = router;