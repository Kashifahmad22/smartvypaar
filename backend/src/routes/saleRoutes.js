const express = require("express");
const router = express.Router();

const {
  createSale,
  getAllSales
} = require("../controllers/saleController");

router.post("/", createSale);
router.get("/", getAllSales);

module.exports = router;