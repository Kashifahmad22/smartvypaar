const Party = require("../models/Party");
const LedgerEntry = require("../models/LedgerEntry");
const mongoose = require("mongoose");

exports.getFinancialSummary = async (req, res, next) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    // ================================
    // 1️⃣ RECEIVABLES & PAYABLES
    // ================================
    const partySummary = await Party.aggregate([
      {
        $match: {
          owner: ownerId,
          isActive: true
        }
      },
      {
        $group: {
          _id: "$type",
          totalBalance: { $sum: "$currentBalance" }
        }
      }
    ]);

    let totalReceivables = 0;
    let totalPayables = 0;

    partySummary.forEach(p => {
      if (p._id === "CUSTOMER") {
        totalReceivables = p.totalBalance;
      }
      if (p._id === "SUPPLIER") {
        totalPayables = p.totalBalance;
      }
    });

    const netPosition = totalReceivables - totalPayables;

    // ================================
    // 2️⃣ MONTHLY CASH FLOW
    // ================================
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthlyLedger = await LedgerEntry.aggregate([
      {
        $match: {
          owner: ownerId,
          createdAt: { $gte: firstDayOfMonth }
        }
      },
      {
        $group: {
          _id: "$transactionType",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    let monthlyCredit = 0;
    let monthlyDebit = 0;

    monthlyLedger.forEach(entry => {
      if (entry._id === "CREDIT") {
        monthlyCredit = entry.totalAmount;
      }
      if (entry._id === "DEBIT") {
        monthlyDebit = entry.totalAmount;
      }
    });

    const monthlyNetCashFlow = monthlyCredit - monthlyDebit;

    res.status(200).json({
      status: "success",
      data: {
        totalReceivables: Math.round(totalReceivables),
        totalPayables: Math.round(totalPayables),
        netPosition: Math.round(netPosition),
        monthlyCredit: Math.round(monthlyCredit),
        monthlyDebit: Math.round(monthlyDebit),
        monthlyNetCashFlow: Math.round(monthlyNetCashFlow)
      }
    });

  } catch (error) {
    next(error);
  }
};