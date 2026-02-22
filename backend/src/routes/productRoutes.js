const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getLowStockProducts,
  restockProduct,
  getUpcomingExpiry
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/low-stock", getLowStockProducts);
router.get("/upcoming-expiry", getUpcomingExpiry);
router.patch("/:id/restock", restockProduct);

module.exports = router;