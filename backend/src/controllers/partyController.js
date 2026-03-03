const Party = require("../models/Party");
const mongoose = require("mongoose");

// =====================================
// CREATE PARTY
// =====================================
exports.createParty = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { name, phone, type, openingBalance = 0 } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required"
      });
    }

    const party = await Party.create({
      owner: ownerId,
      name,
      phone,
      type,
      openingBalance,
      currentBalance: openingBalance
    });

    res.status(201).json({
      success: true,
      data: party
    });

  } catch (err) {
    next(err);
  }
};

// =====================================
// GET ALL PARTIES
// =====================================
exports.getParties = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const { type } = req.query;

    const filter = { owner: ownerId, isActive: true };

    if (type) {
      filter.type = type;
    }

    const parties = await Party.find(filter)
      .select("name phone type currentBalance totalCredit totalDebit")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: parties.length,
      data: parties
    });

  } catch (err) {
    next(err);
  }
};

// =====================================
// GET SINGLE PARTY
// =====================================
exports.getPartyById = async (req, res, next) => {
  try {
    const ownerId = req.user._id;
    const partyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(partyId)) {
      return res.status(400).json({ message: "Invalid party ID" });
    }

    const party = await Party.findOne({
      _id: partyId,
      owner: ownerId
    }).lean();

    if (!party) {
      return res.status(404).json({ message: "Party not found" });
    }

    res.status(200).json({
      success: true,
      data: party
    });

  } catch (err) {
    next(err);
  }
};