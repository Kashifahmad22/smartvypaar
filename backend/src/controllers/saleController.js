const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { createSaleSchema } = require("../validations/saleValidation");
const AppError = require("../utils/AppError");

// =====================================
// CREATE SALE (Atomic + Owner Safe + Validated)
// =====================================
exports.createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 🔐 Zod Validation
    const parsed = createSaleSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      );
    }

    const { productId, quantity } = parsed.data;

    // 🔒 Find product (owner safe)
    const product = await Product.findOne({
      _id: productId,
      owner: req.user._id
    }).session(session);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.stockQuantity < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    // Calculate totals
    const totalAmount =
      product.sellingPrice * quantity;

    const totalProfit =
      (product.sellingPrice - product.costPrice) *
      quantity;

    // Deduct stock
    product.stockQuantity -= quantity;

    const lowStock =
      product.stockQuantity <= product.reorderThreshold;

    await product.save({ session });

    // Create sale
    const [sale] = await Sale.create(
      [{
        product: product._id,
        quantity,
        totalAmount,
        totalProfit,
        owner: req.user._id
      }],
      { session }
    );

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      updatedStock: product.stockQuantity,
      lowStockAlert: lowStock
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error); // 🔥 send to global error middleware
  }
};


// =====================================
// GET ALL SALES
// =====================================
exports.getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find({
      owner: req.user._id
    })
      .populate("product", "name sellingPrice")
      .sort({ createdAt: -1 })
      .lean();

    res.json(sales);

  } catch (error) {
    next(error);
  }
};