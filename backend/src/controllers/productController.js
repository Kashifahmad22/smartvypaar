const Product = require("../models/Product");

// =============================
// CREATE PRODUCT
// =============================
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      costPrice,
      sellingPrice,
      stockQuantity,
      reorderThreshold,
      expiryDate
    } = req.body;

    // Check existing product for THIS USER only
    const existingProduct = await Product.findOne({
      owner: req.user._id,
      name: { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (existingProduct) {
      existingProduct.stockQuantity += Number(stockQuantity);
      existingProduct.sellingPrice = sellingPrice;
      existingProduct.costPrice = costPrice;
      existingProduct.reorderThreshold = reorderThreshold;
      existingProduct.expiryDate = expiryDate || null;

      await existingProduct.save();

      return res.status(200).json({
        message: "Stock updated for existing product",
        product: existingProduct
      });
    }

    // Create new product
    const product = await Product.create({
      name,
      costPrice,
      sellingPrice,
      stockQuantity,
      reorderThreshold,
      expiryDate: expiryDate || null,
      owner: req.user._id
    });

    res.status(201).json(product);

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ error: error.message });
  }
};


// =============================
// GET ALL PRODUCTS (Owner Safe)
// =============================
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      owner: req.user._id
    }).sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// GET LOW STOCK PRODUCTS
// =============================
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      owner: req.user._id,
      $expr: { $lte: ["$stockQuantity", "$reorderThreshold"] }
    });

    res.json(products);

  } catch (error) {
    console.error("Low Stock Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// RESTOCK PRODUCT (Owner Safe)
// =============================
exports.restockProduct = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.stockQuantity += Number(quantity);
    await product.save();

    res.status(200).json(product);

  } catch (error) {
    console.error("Restock error:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// GET UPCOMING EXPIRY (Owner Safe)
// =============================
exports.getUpcomingExpiry = async (req, res) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const products = await Product.find({
      owner: req.user._id,
      expiryDate: {
        $gte: today,
        $lte: next30Days
      }
    });

    res.json(products);

  } catch (error) {
    console.error("Expiry Error:", error);
    res.status(500).json({ error: error.message });
  }
};