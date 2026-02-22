const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    reorderThreshold: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },

    expiryDate: {
      type: Date
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Compound indexes for performance
productSchema.index({ owner: 1, name: 1 });
productSchema.index({ owner: 1, createdAt: -1 });
productSchema.index({ owner: 1, expiryDate: 1 });

module.exports = mongoose.model("Product", productSchema);