const productController = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();


const {
  createProduct,
  getAllProducts,
  getLowStockProducts,
  restockProduct,
  getUpcomingExpiry,
  getDeadStockProducts
} = require("../controllers/productController");

router.post("/", protect, createProduct);
router.get("/", protect, getAllProducts);
router.get("/low-stock", protect, getLowStockProducts);
router.patch("/:id/restock", protect, restockProduct);
router.get("/upcoming-expiry", protect, getUpcomingExpiry);
router.get(
  "/dead-stock",
  protect,
  productController.getDeadStockProducts
);
router.patch("/batch/:batchId", protect, productController.updateBatchQuantity);
router.delete("/batch/:batchId", protect, productController.deleteBatch);

module.exports = router;