const Product = require("../models/Product");
const Sale = require("../models/Sale");


// =====================================
// DASHBOARD STATS (Owner Safe)
// =====================================
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Total products (owner specific)
    const totalProducts = await Product.countDocuments({
      owner: req.user._id
    });

    // Low stock (owner specific)
    const lowStockCount = await Product.countDocuments({
      owner: req.user._id,
      $expr: { $lte: ["$stockQuantity", "$reorderThreshold"] }
    });

    // Today's sales (owner specific)
    const todayStats = await Sale.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: today }
        }
      },
      {
        $addFields: {
          totalProfit: { $ifNull: ["$totalProfit", 0] }
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

    // Weekly revenue + profit (owner specific)
    const weeklyData = await Sale.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $addFields: {
          totalProfit: { $ifNull: ["$totalProfit", 0] }
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
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// TOP SELLING PRODUCTS (Owner Safe)
// =====================================
exports.getTopProducts = async (req, res) => {
  try {
    const topProducts = await Sale.aggregate([
      {
        $match: {
          owner: req.user._id
        }
      },
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

    const filtered = populated.filter(item => item._id);

    res.json(filtered);

  } catch (error) {
    console.error("Top Products Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// WEEKLY PROFIT (Owner Safe)
// =====================================
exports.getWeeklyProfit = async (req, res) => {
  try {
    const profitData = await Sale.aggregate([
      {
        $match: {
          owner: req.user._id
        }
      },
      {
        $addFields: {
          totalProfit: { $ifNull: ["$totalProfit", 0] }
        }
      },
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
    console.error("Weekly Profit Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// =====================================
// BUSINESS HEALTH (Owner Safe)
// =====================================
exports.getBusinessHealth = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({
      owner: req.user._id
    });

    const lowStockCount = await Product.countDocuments({
      owner: req.user._id,
      $expr: { $lte: ["$stockQuantity", "$reorderThreshold"] }
    });

    const expiringCount = await Product.countDocuments({
      owner: req.user._id,
      expiryDate: {
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = await Sale.find({
      owner: req.user._id,
      createdAt: { $gte: today }
    });

    const todayRevenue = todaySales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0
    );

    const todayProfit = todaySales.reduce(
      (sum, sale) => sum + (sale.totalProfit || 0),
      0
    );

    const todaySalesCount = todaySales.length;

    // ===== Health Score Calculation =====

    const profitMargin =
      todayRevenue > 0 ? todayProfit / todayRevenue : 0;

    const inventoryScore =
      totalProducts > 0
        ? 1 - lowStockCount / totalProducts
        : 1;

    const expiryScore =
      totalProducts > 0
        ? 1 - expiringCount / totalProducts
        : 1;

    const salesScore =
      todaySalesCount > 0 ? 1 : 0;

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
    console.error("Business Health Error:", error);
    res.status(500).json({ error: error.message });
  }
};