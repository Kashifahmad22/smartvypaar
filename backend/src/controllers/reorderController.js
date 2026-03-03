const Product = require("../models/Product");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

// ======================================================
// 📦 REORDER RECOMMENDATION ENGINE
// ======================================================
exports.getReorderRecommendations = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    const expiryAlertDays = 7;

    // 1️⃣ Fetch active products
    const products = await Product.find({
      owner: ownerId,
      isActive: true
    }).lean();

    // 2️⃣ Aggregate sales (single query)
    const salesData = await Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" }
        }
      }
    ]);

    // Create lookup map
    const salesMap = {};
    salesData.forEach((s) => {
      salesMap[s._id.toString()] = s.totalSold;
    });

    const recommendations = [];

    for (const product of products) {

      const totalSoldLast30Days =
        salesMap[product._id.toString()] || 0;

      const avgDailySales = totalSoldLast30Days / 30;

      if (avgDailySales === 0) continue;

      // ============================
      // Batch Intelligence
      // ============================
      let usableStock = 0;
      let expiredStock = 0;
      let nearExpiryStock = 0;

      for (const batch of product.batches || []) {

        if (!batch.quantity || batch.quantity <= 0) continue;

        if (batch.expiryDate) {
          const expiryDate = new Date(batch.expiryDate);
          const daysToExpiry =
            (expiryDate - today) / (1000 * 60 * 60 * 24);

          if (daysToExpiry <= 0) {
            expiredStock += batch.quantity;
            continue;
          }

          if (daysToExpiry <= expiryAlertDays) {
            nearExpiryStock += batch.quantity;
          }
        }

        usableStock += batch.quantity;
      }

      const daysUntilStockout =
        avgDailySales > 0
          ? usableStock / avgDailySales
          : Infinity;

      const leadTime = product.leadTimeDays || 3;
      const safetyBuffer = 0.2;

      const predictedNeed =
        avgDailySales * leadTime * (1 + safetyBuffer);

      const reorderThreshold = product.reorderThreshold || 0;

      const shouldRecommend =
        usableStock <= reorderThreshold ||
        daysUntilStockout <= leadTime * 3;

      if (!shouldRecommend) continue;

      let riskLevel = "LOW";

      if (daysUntilStockout <= leadTime) {
        riskLevel = "HIGH";
      } else if (daysUntilStockout <= leadTime * 2) {
        riskLevel = "MEDIUM";
      }

      const expiryRisk =
        nearExpiryStock > avgDailySales * expiryAlertDays;

      const urgencyScore =
        daysUntilStockout > 0
          ? Number((1 / daysUntilStockout).toFixed(3))
          : 999;

      recommendations.push({
        productId: product._id,
        name: product.name,

        currentUsableStock: usableStock,
        expiredStock,
        nearExpiryStock,

        avgDailySales: Number(avgDailySales.toFixed(2)),
        daysUntilStockout: Number(daysUntilStockout.toFixed(1)),

        recommendedOrderQty: Math.ceil(predictedNeed),

        riskLevel,
        expiryRisk,
        urgencyScore
      });
    }

    recommendations.sort(
      (a, b) => b.urgencyScore - a.urgencyScore
    );

    res.status(200).json({
      status: "success",
      results: recommendations.length,
      data: recommendations
    });

  } catch (err) {
    next(err);
  }
};

// ======================================================
// 🚀 VELOCITY CLASSIFICATION ENGINE
// ======================================================
exports.getVelocityClassification = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    // Fetch products
    const products = await Product.find({
      owner: ownerId,
      isActive: true
    }).lean();

    // Aggregate sales once
    const salesData = await Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: last30Days }
        }
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" }
        }
      }
    ]);

    const salesMap = {};
    salesData.forEach((s) => {
      salesMap[s._id.toString()] = s.totalSold;
    });

    const results = [];

    for (const product of products) {

      const totalSold =
        salesMap[product._id.toString()] || 0;

      const avgDailySales = totalSold / 30;

      let classification = "DEAD_STOCK";

      if (avgDailySales >= 5) {
        classification = "FAST_MOVING";
      } else if (avgDailySales >= 2) {
        classification = "STABLE";
      } else if (avgDailySales > 0) {
        classification = "SLOW_MOVING";
      }

      results.push({
        productId: product._id,
        name: product.name,
        totalSoldLast30Days: totalSold,
        avgDailySales: Number(avgDailySales.toFixed(2)),
        classification
      });
    }

    results.sort(
      (a, b) => b.avgDailySales - a.avgDailySales
    );

    res.status(200).json({
      status: "success",
      results: results.length,
      data: results
    });

  } catch (err) {
    next(err);
  }
};