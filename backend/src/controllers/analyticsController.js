const Product = require("../models/Product");
const Sale = require("../models/Sale");
const mongoose = require("mongoose");

const logError = (message, error) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, error);
  }
};

// =====================================
// DASHBOARD STATS (Batch Compatible)
// =====================================
exports.getDashboardStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const totalProducts = await Product.countDocuments({ owner: ownerId });

    const lowStockCount = await Product.countDocuments({
      owner: ownerId,
      $expr: { $lte: ["$totalStock", "$reorderThreshold"] }
    });

    const todayStats = await Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$totalAmount" },
          todaySalesCount: { $sum: 1 },
          todayProfit: { $sum: "$totalProfit" }
        }
      }
    ]);

    const todayRevenue = todayStats[0]?.todayRevenue || 0;
    const todaySalesCount = todayStats[0]?.todaySalesCount || 0;
    const todayProfit = todayStats[0]?.todayProfit || 0;

    const weeklyData = await Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalProfit: { $sum: "$totalProfit" },
          totalSales: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalProducts,
      lowStockCount,
      todayRevenue,
      todaySalesCount,
      todayProfit,
      weeklyData
    });

  } catch (error) {
    logError("Dashboard Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =====================================
// MONTHLY SUMMARY
// =====================================
exports.getMonthlySummary = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const sales = await Sale.find({
      owner: ownerId,
      createdAt: { $gte: startOfMonth }
    }).lean();

    const totalRevenue = sales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    const totalProfit = sales.reduce(
      (sum, sale) => sum + sale.totalProfit,
      0
    );

    const productStats = {};

    sales.forEach((sale) => {
      const id = sale.product?.toString();
      if (!id) return;
      productStats[id] = (productStats[id] || 0) + sale.quantity;
    });

    let bestSellingProduct = null;
    let slowestProduct = null;

    const productIds = Object.keys(productStats);

    if (productIds.length > 0) {
      const products = await Product.find({
        _id: { $in: productIds }
      }).lean();

      products.forEach((product) => {
        const quantity = productStats[product._id];

        if (!bestSellingProduct || quantity > bestSellingProduct.quantity) {
          bestSellingProduct = {
            name: product.name,
            quantity
          };
        }

        if (!slowestProduct || quantity < slowestProduct.quantity) {
          slowestProduct = {
            name: product.name,
            quantity
          };
        }
      });
    }

    res.json({
      totalRevenue,
      totalProfit,
      bestSellingProduct,
      slowestProduct
    });

  } catch (error) {
    logError("Monthly Summary Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =====================================
// TOP PRODUCTS
// =====================================
exports.getTopProducts = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const topProducts = await Sale.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    const populated = await Product.populate(topProducts, {
      path: "_id",
      select: "name"
    });

    res.json(populated.filter(item => item._id));

  } catch (error) {
    logError("Top Products Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =====================================
// WEEKLY PROFIT
// =====================================
exports.getWeeklyProfit = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const profitData = await Sale.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalProfit: { $sum: "$totalProfit" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(profitData);

  } catch (error) {
    logError("Weekly Profit Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// =====================================
// BUSINESS HEALTH (Batch Compatible)
// =====================================
exports.getBusinessHealth = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const totalProducts = await Product.countDocuments({ owner: ownerId });

    const lowStockCount = await Product.countDocuments({
      owner: ownerId,
      $expr: { $lte: ["$totalStock", "$reorderThreshold"] }
    });

    const expiringCount = await Product.countDocuments({
      owner: ownerId,
      "batches.expiryDate": {
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStats = await Sale.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$totalAmount" },
          todayProfit: { $sum: "$totalProfit" },
          todaySalesCount: { $sum: 1 }
        }
      }
    ]);

    const todayRevenue = todayStats[0]?.todayRevenue || 0;
    const todayProfit = todayStats[0]?.todayProfit || 0;
    const todaySalesCount = todayStats[0]?.todaySalesCount || 0;

    const profitMargin = todayRevenue > 0 ? todayProfit / todayRevenue : 0;
    const inventoryScore = totalProducts > 0 ? 1 - lowStockCount / totalProducts : 1;
    const expiryScore = totalProducts > 0 ? 1 - expiringCount / totalProducts : 1;
    const salesScore = todaySalesCount > 0 ? 1 : 0;

    const finalScore =
      profitMargin * 40 +
      inventoryScore * 25 +
      expiryScore * 20 +
      salesScore * 15;

    let status = "Critical";
    if (finalScore > 75) status = "Excellent";
    else if (finalScore > 60) status = "Healthy";
    else if (finalScore > 40) status = "Average";

    res.json({
      score: Math.round(finalScore),
      status,
      breakdown: {
        profitComponent: Math.round(profitMargin * 40),
        inventoryComponent: Math.round(inventoryScore * 25),
        expiryComponent: Math.round(expiryScore * 20),
        activityComponent: Math.round(salesScore * 15)
      },
      business: {
        shopName: req.user.shopName,
        totalProducts,
        lowStockCount,
        expiringCount,
        todayRevenue,
        todayProfit
      }
    });

  } catch (error) {
    logError("Business Health Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};