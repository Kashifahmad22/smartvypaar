const Product = require("../models/Product");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

// ======================================================
// 🧠 SMART INSIGHTS SUMMARY CONTROLLER
// ======================================================
exports.getSmartInsightsSummary = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const today = new Date();
    const last30Days = new Date();
    last30Days.setDate(today.getDate() - 30);

    // ===============================
    // 1️⃣ Fetch Active Products
    // ===============================
    const products = await Product.find({
      owner: ownerId,
      isActive: true
    }).lean();

    // ===============================
    // 2️⃣ Aggregate 30-Day Sales
    // ===============================
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
          totalSold: { $sum: "$quantity" },
          totalProfit: { $sum: "$totalProfit" },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const salesMap = {};
    salesData.forEach(s => {
      salesMap[s._id.toString()] = s;
    });

    // ===============================
    // 3️⃣ Intelligence Calculations
    // ===============================
    let stockoutRisks = 0;
    let deadStockCount = 0;
    let slowMovingCount = 0;
    let fastMovingCount = 0;

    let deadStockValue = 0;
    let inventoryValue = 0;
    let projected7DayRevenue = 0;

    let marginRanking = [];

    for (const product of products) {

      const sales = salesMap[product._id.toString()];
      const totalSold = sales?.totalSold || 0;
      const avgDailySales = totalSold / 30;

      const usableStock = product.totalStock || 0;

      const firstBatch = product.batches?.[0] || {};
      const costPrice = firstBatch.costPrice || 0;
      const sellingPrice = firstBatch.sellingPrice || 0;

      // ================= Inventory Value =================
      inventoryValue += usableStock * costPrice;

      // ================= Dead Stock =================
      if (avgDailySales === 0) {
        deadStockCount++;
        deadStockValue += usableStock * costPrice;
      }

      // ================= Velocity Classification =================
      if (avgDailySales >= 5) {
        fastMovingCount++;
      } else if (avgDailySales > 0 && avgDailySales < 2) {
        slowMovingCount++;
      }

      // ================= Stockout Risk =================
      const leadTime = product.leadTimeDays || 3;

      if (avgDailySales > 0) {
        const daysUntilStockout = usableStock / avgDailySales;
        if (daysUntilStockout <= leadTime) {
          stockoutRisks++;
        }

        // 7 Day Revenue Forecast
        projected7DayRevenue +=
          avgDailySales * sellingPrice * 7;
      }

      // ================= Margin Ranking =================
      if (sales?.totalProfit && sales.totalProfit > 0) {
        marginRanking.push({
          name: product.name,
          profit: sales.totalProfit
        });
      }
    }

    // Sort highest profit first
    marginRanking.sort((a, b) => b.profit - a.profit);

    const topMarginProduct =
      marginRanking.length > 0 ? marginRanking[0] : null;

    // ===============================
    // 4️⃣ Final Response
    // ===============================
    res.status(200).json({
      status: "success",
      data: {
        stockoutRisks,
        deadStockCount,
        slowMovingCount,
        fastMovingCount,
        deadStockValue: Math.round(deadStockValue),
        inventoryValue: Math.round(inventoryValue),

        // 🔥 Added for Dashboard compatibility
        topMarginProduct,

        // 🔥 Used by Insights page
        top3MarginProducts: marginRanking.slice(0, 3),

        projected7DayRevenue: Math.round(projected7DayRevenue)
      }
    });

  } catch (err) {
    console.error("Smart Insights Error:", err);
    next(err);
  }
};