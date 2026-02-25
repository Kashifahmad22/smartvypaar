const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Utility
const escapeRegex = (text) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ======================================
// CREATE PRODUCT (Batch Intelligent)
// ======================================
exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      category,
      subcategory,
      barcode,
      sku,
      unit,
      packageSize,
      reorderThreshold,

      batchNumber,
      purchaseDate,
      expiryDate,
      costPrice,
      sellingPrice,
      mrp,
      quantity,
      supplierName,
      invoiceNumber
    } = req.body;

    // ===== STRICT VALIDATION =====
    if (!name) throw new AppError("Product name is required", 400);
    if (!batchNumber) throw new AppError("Batch number is required", 400);
    if (!purchaseDate) throw new AppError("Purchase date is required", 400);

    if (!costPrice || costPrice <= 0)
      throw new AppError("Valid cost price required", 400);

    if (!sellingPrice || sellingPrice <= 0)
      throw new AppError("Valid selling price required", 400);

    if (!mrp || mrp <= 0)
      throw new AppError("Valid MRP required", 400);

    if (!quantity || quantity <= 0)
      throw new AppError("Quantity must be greater than 0", 400);

    const safeName = escapeRegex(name.trim());

    let product = await Product.findOne({
      owner: req.user._id,
      name: { $regex: new RegExp(`^${safeName}$`, "i") }
    });

    const newBatch = {
      batchNumber,
      purchaseDate: new Date(purchaseDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      mrp: Number(mrp),
      quantity: Number(quantity),
      supplierName: supplierName || "",
      invoiceNumber: invoiceNumber || ""
    };

    // ==========================
    // CREATE NEW PRODUCT
    // ==========================
    if (!product) {
      product = await Product.create({
        owner: req.user._id,
        name,
        brand,
        category,
        subcategory,
        barcode,
        sku,
        unit,
        packageSize,
        reorderThreshold: reorderThreshold || 10,
        batches: [newBatch],
        totalStock: Number(quantity)
      });

      return res.status(201).json(product);
    }

    // ==========================
    // EXISTING PRODUCT → ADD BATCH
    // ==========================
    const duplicateBatch = product.batches.find(
      (b) => b.batchNumber === batchNumber
    );

    if (duplicateBatch) {
      throw new AppError(
        "Batch number already exists for this product",
        400
      );
    }

    product.batches.push(newBatch);
    product.totalStock += Number(quantity);

    await product.save();

    res.status(200).json(product);

  } catch (error) {
    next(error);
  }
};

// ======================================
// GET ALL PRODUCTS (Optimized)
// ======================================
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find(
      { owner: req.user._id },
      {
        name: 1,
        brand: 1,
        category: 1,
        reorderThreshold: 1,
        totalStock: 1,
        batches: 1,
        createdAt: 1
      }
    )
      .sort({ createdAt: -1 })
      .lean();

    // 🔥 FEFO sorting for UI consistency
    products.forEach(product => {
      product.batches.sort((a, b) => {
        if (!a.expiryDate) return 1;
        if (!b.expiryDate) return -1;
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      });
    });

    res.json(products);

  } catch (error) {
    next(error);
  }
};

// ======================================
// GET LOW STOCK PRODUCTS
// ======================================
exports.getLowStockProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      owner: req.user._id,
      $expr: { $lte: ["$totalStock", "$reorderThreshold"] }
    }).lean();

    res.json(products);

  } catch (error) {
    next(error);
  }
};

// ======================================
// RESTOCK PRODUCT (Smart ERP Mode)
// ======================================
exports.restockProduct = async (req, res, next) => {
  try {
    const {
      batchNumber,
      purchaseDate,
      expiryDate,
      costPrice,
      sellingPrice,
      mrp,
      quantity,
      supplierName,
      invoiceNumber
    } = req.body;

    if (!batchNumber)
      throw new AppError("Batch number required", 400);

    if (!purchaseDate)
      throw new AppError("Purchase date required", 400);

    if (!quantity || quantity <= 0)
      throw new AppError("Quantity must be greater than 0", 400);

    if (!costPrice || costPrice <= 0)
      throw new AppError("Valid cost price required", 400);

    if (!sellingPrice || sellingPrice <= 0)
      throw new AppError("Valid selling price required", 400);

    if (!mrp || mrp <= 0)
      throw new AppError("Valid MRP required", 400);

    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!product)
      throw new AppError("Product not found", 404);

    const existingBatch = product.batches.find(
      (b) => b.batchNumber === batchNumber
    );

    if (existingBatch) {
      // 🔥 SMART MODE: increase existing batch quantity
      existingBatch.quantity += Number(quantity);

      // Update pricing if provided
      existingBatch.costPrice = Number(costPrice);
      existingBatch.sellingPrice = Number(sellingPrice);
      existingBatch.mrp = Number(mrp);

      if (expiryDate)
        existingBatch.expiryDate = new Date(expiryDate);

      if (supplierName)
        existingBatch.supplierName = supplierName;

      if (invoiceNumber)
        existingBatch.invoiceNumber = invoiceNumber;

    } else {
      // New batch
      product.batches.push({
        batchNumber,
        purchaseDate: new Date(purchaseDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        mrp: Number(mrp),
        quantity: Number(quantity),
        supplierName: supplierName || "",
        invoiceNumber: invoiceNumber || ""
      });
    }

    product.totalStock += Number(quantity);

    await product.save();

    res.json({
      message: existingBatch
        ? "Existing batch updated successfully"
        : "New batch added successfully",
      product
    });

  } catch (error) {
    next(error);
  }
};

// ======================================
// GET UPCOMING EXPIRY (Batch Level)
// ======================================
exports.getUpcomingExpiry = async (req, res, next) => {
  try {
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);

    const products = await Product.find({
      owner: req.user._id,
      "batches.expiryDate": {
        $gte: today,
        $lte: next30Days
      }
    }).lean();

    res.json(products);

  } catch (error) {
    next(error);
  }
};

// ======================================
// UPDATE BATCH QUANTITY
// ======================================
exports.updateBatchQuantity = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { quantity } = req.body;

    if (quantity < 0)
      throw new AppError("Quantity cannot be negative", 400);

    const product = await Product.findOne({
      owner: req.user._id,
      "batches._id": batchId
    });

    if (!product)
      throw new AppError("Batch not found", 404);

    const batch = product.batches.id(batchId);

    const difference = quantity - batch.quantity;

    batch.quantity = quantity;
    product.totalStock += difference;

    if (product.totalStock < 0)
      throw new AppError("Invalid stock operation", 400);

    await product.save();

    res.json({ message: "Batch updated", product });

  } catch (error) {
    next(error);
  }
};

// ======================================
// DELETE BATCH (SAFE)
// ======================================
exports.deleteBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;

    const product = await Product.findOne({
      owner: req.user._id,
      "batches._id": batchId
    });

    if (!product)
      throw new AppError("Batch not found", 404);

    const batch = product.batches.id(batchId);

    if (batch.quantity > 0)
      throw new AppError(
        "Cannot delete batch with remaining stock",
        400
      );

    batch.deleteOne();
    await product.save();

    res.json({ message: "Batch deleted", product });

  } catch (error) {
    next(error);
  }
};


// ======================================
// GET DEAD STOCK
// ======================================
exports.getDeadStockProducts = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const products = await Product.find({
      owner: req.user._id,
      totalStock: { $gt: 0 },
      $or: [
        { lastSoldAt: { $exists: false } },
        { lastSoldAt: null },
        { lastSoldAt: { $lt: thirtyDaysAgo } }
      ]
    }).lean();

    res.json(products);

  } catch (error) {
    next(error);
  }
};