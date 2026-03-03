const LedgerEntry = require("../models/LedgerEntry");
const Party = require("../models/Party");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");

// =====================================
// INTERNAL SIMPLE SME LEDGER ENGINE
// =====================================
async function processLedgerEntry({
  ownerId,
  partyId,
  transactionType,
  amount,
  taxableAmount = 0,
  gstRate = 0,
  gstAmount = 0,
  invoiceNumber,
  description,
  paymentMethod,
  session
}) {

  if (!partyId || !transactionType || !amount) {
    throw new AppError("Required ledger fields missing", 400);
  }

  if (!["CREDIT", "DEBIT"].includes(transactionType)) {
    throw new AppError("Invalid transaction type", 400);
  }

  const party = await Party.findOne({
    _id: partyId,
    owner: ownerId
  }).session(session);

  if (!party) {
    throw new AppError("Party not found", 404);
  }

  /*
    SME LOGIC:

    DEBIT  = Paise Gaye  → Dues Increase
    CREDIT = Paise Aaye  → Dues Decrease
  */

  let delta = 0;

  if (transactionType === "DEBIT") {
    delta = amount; // increase dues
    party.totalDebit += amount;
  }

  if (transactionType === "CREDIT") {
    delta = -amount; // reduce dues
    party.totalCredit += amount;
  }

  const newBalance = party.currentBalance + delta;

  party.currentBalance = newBalance;

  await party.save({ session });

  await LedgerEntry.create(
    [{
      owner: ownerId,
      party: partyId,
      transactionType,
      amount,
      taxableAmount,
      gstRate,
      gstAmount,
      invoiceNumber,
      description,
      paymentMethod,
      runningBalance: newBalance
    }],
    { session }
  );

  return newBalance;
}

// =====================================
// ADD LEDGER ENTRY
// =====================================
exports.addLedgerEntry = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const ownerId = req.user._id;

    const newBalance = await processLedgerEntry({
      ownerId,
      ...req.body,
      session
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      updatedBalance: newBalance
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

// =====================================
// GET LEDGER HISTORY
// =====================================
exports.getLedgerHistory = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const partyId = req.params.partyId;

    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const entries = await LedgerEntry.find({
      owner: ownerId,
      party: partyId
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      page,
      count: entries.length,
      data: entries
    });

  } catch (err) {
    next(err);
  }
};

exports.processLedgerEntry = processLedgerEntry;