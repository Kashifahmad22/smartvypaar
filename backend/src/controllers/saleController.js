const Sale = require("../models/Sale");
const Product = require("../models/Product");

// 🔹 Create Sale and Decrease Stock
exports.createSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        message: "Product ID and quantity are required"
      });
    }

    const numericQuantity = Number(quantity);

    if (numericQuantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0"
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // Check stock availability
    if (product.stockQuantity < numericQuantity) {
      return res.status(400).json({
        message: "Insufficient stock"
      });
    }

    // Calculate totals
    const totalAmount =
      product.sellingPrice * numericQuantity;

    const totalProfit =
      (product.sellingPrice - product.costPrice) *
      numericQuantity;

    // Reduce stock
    product.stockQuantity -= numericQuantity;

    const lowStock =
      product.stockQuantity <= product.reorderThreshold;

    await product.save();

    // Create sale record
    const sale = await Sale.create({
      product: product._id,
      quantity: numericQuantity,
      totalAmount,
      totalProfit
    });

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      updatedStock: product.stockQuantity,
      lowStockAlert: lowStock
    });

  } catch (error) {
    console.error("Sale Error:", error);
    res.status(500).json({
      error: error.message
    });
  }
};

// 🔹 Get All Sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("product", "name sellingPrice")
      .sort({ createdAt: -1 });

    res.json(sales);

  } catch (error) {
    console.error("Get Sales Error:", error);
    res.status(500).json({
      error: error.message
    });
  }
};