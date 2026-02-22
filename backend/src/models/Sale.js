const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    totalProfit: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
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

// Compound indexes
saleSchema.index({ owner: 1, createdAt: -1 });
saleSchema.index({ owner: 1, product: 1 });

module.exports = mongoose.model("Sale", saleSchema);