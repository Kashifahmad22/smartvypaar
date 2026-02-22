const Product = require("../models/Product");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, sellingPrice, stockQuantity, reorderThreshold } = req.body;

    // Check if product already exists (case insensitive)
    const existingProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (existingProduct) {
      // Update stock instead of creating duplicate
      existingProduct.stockQuantity += Number(stockQuantity);

      // Optionally update price & threshold
      existingProduct.sellingPrice = sellingPrice;
      existingProduct.reorderThreshold = reorderThreshold;

      await existingProduct.save();

      return res.status(200).json({
        message: "Stock updated for existing product",
        product: existingProduct
      });
    }

    // Otherwise create new product
    const product = await Product.create(req.body);

    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Low Stock Products
exports.getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$stockQuantity", "$reorderThreshold"] }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.restockProduct = async (req, res) => {
 
    try {

    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stockQuantity: Number(quantity) } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(updatedProduct);

  } catch (error) {
    console.error("Restock error:", error);
    return res.status(500).json({ error: error.message });
  }
};
exports.getUpcomingExpiry = async (req, res) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const products = await Product.find({
      expiryDate: { $gte: today, $lte: next30Days }
    });

    res.json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};