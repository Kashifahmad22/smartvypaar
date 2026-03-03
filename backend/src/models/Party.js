const mongoose = require("mongoose");

const partySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    type: {
      type: String,
      enum: ["CUSTOMER", "SUPPLIER"],
      required: true,
      index: true
    },

    openingBalance: {
      type: Number,
      default: 0
    },

    currentBalance: {
      type: Number,
      default: 0,
      index: true
    },

    totalCredit: {
      type: Number,
      default: 0
    },

    totalDebit: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Compound index for fast filtering
partySchema.index({ owner: 1, type: 1 });

module.exports = mongoose.model("Party", partySchema);