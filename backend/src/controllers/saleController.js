const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const { processLedgerEntry } = require("./ledgerController");
const { createSaleSchema } = require("../validations/saleValidation");
const AppError = require("../utils/AppError");

// =====================================
// CREATE SALE (Inventory + Ledger Engine)
// =====================================
exports.createSale = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const parsed = createSaleSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.issues?.[0]?.message || "Validation failed",
        400
      );
    }

    const {
      productId,
      quantity,
      customerId,
      paymentReceived = 0,
      paymentMethod = "CASH",
      taxableAmount = 0,
      gstRate = 0,
      gstAmount = 0,
      invoiceNumber
    } = parsed.data;

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

    // ================= FEFO =================
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

    product.totalStock -= quantity;
    product.totalSoldQuantity += quantity;
    product.lastSoldAt = new Date();

    await product.save({ session });

    // ================= PAYMENT CALCULATION =================
    const amountPaid = Number(paymentReceived) || 0;

    if (amountPaid > totalAmount) {
      throw new AppError("Payment cannot exceed sale amount", 400);
    }

    const amountDue = totalAmount - amountPaid;

    let paymentStatus = "UNPAID";
    if (amountDue === 0) paymentStatus = "PAID";
    else if (amountPaid > 0) paymentStatus = "PARTIAL";

    const [sale] = await Sale.create(
      [{
        product: product._id,
        owner: req.user._id,
        quantity,
        batchBreakdown,
        totalAmount,
        totalProfit,
        customer: customerId || null,
        paymentReceived: amountPaid,
        paymentMethod,
        taxableAmount,
        gstRate,
        gstAmount,
        invoiceNumber,
        amountDue,
        paymentStatus
      }],
      { session }
    );

    // =====================================
    // 🔥 LEDGER ENGINE (Single Source of Truth)
    // =====================================
    if (customerId) {

      // 1️⃣ SALE ENTRY
      await processLedgerEntry({
        ownerId: req.user._id,
        partyId: customerId,
        transactionType: "DEBIT",
        amount: totalAmount,
        taxableAmount,
        gstRate,
        gstAmount,
        invoiceNumber,
        description: `Sale Invoice ${invoiceNumber || ""}`,
        paymentMethod,
        session
      });

      // 2️⃣ PAYMENT ENTRY
      if (amountPaid > 0) {
        await processLedgerEntry({
          ownerId: req.user._id,
          partyId: customerId,
          transactionType: "CREDIT",
          amount: amountPaid,
          invoiceNumber,
          description: `Payment received for invoice ${invoiceNumber || ""}`,
          paymentMethod,
          session
        });
      }
    }

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
// GET ALL SALES
// =====================================
exports.getAllSales = async (req, res, next) => {
  try {
    const sales = await Sale.find({
      owner: req.user._id
    })
      .populate("product", "name")
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(sales);

  } catch (error) {
    next(error);
  }
};