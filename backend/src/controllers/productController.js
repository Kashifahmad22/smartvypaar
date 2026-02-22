const Product = require("../models/Product");
const {
  createProductSchema,
  restockSchema
} = require("../validations/productValidation");
const AppError = require("../utils/AppError");

// Utility: Escape regex special characters
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// =============================
// CREATE PRODUCT
// =============================
exports.createProduct = async (req, res, next) => {
  try {
    // 🔐 Zod Validation
    const parsed = createProductSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      );
    }

    const {
      name,
      costPrice,
      sellingPrice,
      stockQuantity,
      reorderThreshold,
      expiryDate
    } = parsed.data;

    const safeName = escapeRegex(name);

    // Check existing product (owner safe)
    const existingProduct = await Product.findOne({
      owner: req.user._id,
      name: { $regex: new RegExp(`^${safeName}$`, "i") }
    });

    if (existingProduct) {
      existingProduct.stockQuantity += stockQuantity;
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
    next(error);
  }
};


// =============================
// GET ALL PRODUCTS
// =============================
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      owner: req.user._id
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json(products);

  } catch (error) {
    next(error);
  }
};


// =============================
// GET LOW STOCK PRODUCTS
// =============================
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      owner: req.user._id,
      $expr: { $lte: ["$stockQuantity", "$reorderThreshold"] }
    }).lean();

    res.json(products);

  } catch (error) {
    next(error);
  }
};


// =============================
// RESTOCK PRODUCT
// =============================
exports.restockProduct = async (req, res, next) => {
  try {
    // 🔐 Zod Validation
    const parsed = restockSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      );
    }

    const { quantity } = parsed.data;

    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    product.stockQuantity += quantity;
    await product.save();

    res.status(200).json(product);

  } catch (error) {
    next(error);
  }
};


// =============================
// GET UPCOMING EXPIRY
// =============================
exports.getUpcomingExpiry = async (req, res, next) => {
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
    }).lean();

    res.json(products);

  } catch (error) {
    next(error);
  }
};