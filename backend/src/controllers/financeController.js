const Party = require("../models/Party");
const LedgerEntry = require("../models/LedgerEntry");
const mongoose = require("mongoose");

// =====================================
// FINANCIAL SUMMARY
// =====================================
exports.getFinancialSummary = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    // ===============================
    // 1️⃣ Receivable & Payable
    // ===============================
    const parties = await Party.find({
      owner: ownerId,
      isActive: true
    }).select("currentBalance").lean();

    let totalReceivable = 0;
    let totalPayable = 0;

    parties.forEach(p => {
      if (p.currentBalance > 0) {
        totalReceivable += p.currentBalance;
      } else if (p.currentBalance < 0) {
        totalPayable += Math.abs(p.currentBalance);
      }
    });

    const netPosition = totalReceivable - totalPayable;

    // ===============================
    // 2️⃣ Today's Cash Flow
    // ===============================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cashFlow = await LedgerEntry.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: "$transactionType",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let cashInToday = 0;
    let cashOutToday = 0;

    cashFlow.forEach(entry => {
      if (entry._id === "PAYMENT_RECEIVED") {
        cashInToday = entry.total;
      }
      if (entry._id === "PAYMENT_MADE") {
        cashOutToday = entry.total;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalReceivable: Math.round(totalReceivable),
        totalPayable: Math.round(totalPayable),
        netPosition: Math.round(netPosition),
        cashInToday: Math.round(cashInToday),
        cashOutToday: Math.round(cashOutToday)
      }
    });

  } catch (err) {
    next(err);
  }
};