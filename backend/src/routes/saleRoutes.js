const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createSale,
  getAllSales
} = require("../controllers/saleController");

router.post("/", protect, createSale);
router.get("/", protect, getAllSales);

module.exports = router;