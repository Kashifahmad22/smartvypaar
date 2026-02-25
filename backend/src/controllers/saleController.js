const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { createSaleSchema } = require("../validations/saleValidation");
const AppError = require("../utils/AppError");


// =====================================
// CREATE SALE (Enterprise FEFO Engine)
// =====================================
exports.createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parsed = createSaleSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      );
    }

    const { productId, quantity } = parsed.data;

    const product = await Product.findOne({
      _id: productId,
      owner: req.user._id
    }).session(session);

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    if (product.totalStock < quantity) {
      throw new AppError("Insufficient stock", 400);
    }

    let remainingQty = quantity;
    let totalAmount = 0;
    let totalProfit = 0;
    const batchBreakdown = [];

    // 🔥 FEFO (First Expiry First Out)
    const sortedBatches = product.batches
      .filter(b => b.quantity > 0)
      .sort((a, b) => {
        if (a.expiryDate && b.expiryDate) {
          return new Date(a.expiryDate) - new Date(b.expiryDate);
        }
        if (a.expiryDate) return -1;
        if (b.expiryDate) return 1;
        return new Date(a.purchaseDate) - new Date(b.purchaseDate);
      });

    for (const batch of sortedBatches) {
      if (remainingQty <= 0) break;

      const deductQty = Math.min(batch.quantity, remainingQty);

      const amount = deductQty * batch.sellingPrice;
      const profit =
        deductQty * (batch.sellingPrice - batch.costPrice);

      batch.quantity -= deductQty;
      remainingQty -= deductQty;

      totalAmount += amount;
      totalProfit += profit;

      batchBreakdown.push({
        batchId: batch._id,
        batchNumber: batch.batchNumber,
        quantity: deductQty,
        costPrice: batch.costPrice,
        sellingPrice: batch.sellingPrice,
        profit
      });
    }

    if (remainingQty > 0) {
      throw new AppError("Stock deduction mismatch", 500);
    }

    // 🔥 Update product intelligence
    product.totalStock -= quantity;
    product.totalSoldQuantity += quantity;
    product.lastSoldAt = new Date();

    await product.save({ session });

    const [sale] = await Sale.create(
      [{
        product: product._id,
        owner: req.user._id,
        quantity,
        batchBreakdown,
        totalAmount,
        totalProfit
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Sale recorded successfully",
      sale,
      updatedStock: product.totalStock,
      lowStockAlert:
        product.totalStock <= product.reorderThreshold
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


// =====================================
// GET ALL SALES (Owner Safe)
// =====================================
exports.getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find({
      owner: req.user._id
    })
      .populate("product", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(sales);

  } catch (error) {
    next(error);
  }
};