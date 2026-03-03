const mongoose = require("mongoose");

const ledgerEntrySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      required: true,
      index: true
    },

   transactionType: {
  type: String,
  enum: ["CREDIT", "DEBIT"],
  required: true
},

    amount: {
      type: Number,
      required: true
    },

    taxableAmount: {
      type: Number,
      default: 0
    },

    gstRate: {
      type: Number,
      default: 0
    },

    gstAmount: {
      type: Number,
      default: 0
    },

    invoiceNumber: {
      type: String,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK", "CARD", "OTHER"],
      default: "CASH"
    },

    runningBalance: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// Index for fast history queries
ledgerEntrySchema.index({ owner: 1, party: 1, createdAt: -1 });

module.exports = mongoose.model("LedgerEntry", ledgerEntrySchema);