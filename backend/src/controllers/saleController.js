const Sale = require("../models/Sale");
const Product = require("../models/Product");

// =====================================
// CREATE SALE (Owner Safe)
// =====================================
exports.createSale = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

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

    // 🔒 Find product only if it belongs to logged-in user
    const product = await Product.findOne({
      _id: productId,
      owner: req.user._id
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

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

    // 🔒 Attach owner to sale
    const sale = await Sale.create({
      product: product._id,
      quantity: numericQuantity,
      totalAmount,
      totalProfit,
      owner: req.user._id
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


// =====================================
// GET ALL SALES (Owner Safe)
// =====================================
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find({
      owner: req.user._id
    })
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