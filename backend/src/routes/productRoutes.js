const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getLowStockProducts,
  restockProduct,
  getUpcomingExpiry
} = require("../controllers/productController");

router.post("/", protect, createProduct);
router.get("/", protect, getAllProducts);
router.get("/low-stock", protect, getLowStockProducts);
router.patch("/:id/restock", protect, restockProduct);
router.get("/upcoming-expiry", protect, getUpcomingExpiry);
module.exports = router;