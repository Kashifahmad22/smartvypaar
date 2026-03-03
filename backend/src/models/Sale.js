const mongoose = require("mongoose");

const batchSaleSchema = new mongoose.Schema(
  {
    batchId: {
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: "Product"
},
    batchNumber: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    costPrice: {
      type: Number,
      required: true
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    profit: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    quantity: {
      type: Number,
      required: true
    },

    batchBreakdown: {
      type: [batchSaleSchema],
      default: []
    },

    totalAmount: {
      type: Number,
      required: true
    },

    totalProfit: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

// Performance indexes
saleSchema.index({ owner: 1, createdAt: -1 });
saleSchema.index({ owner: 1, product: 1 });

saleSchema.index({ owner: 1, createdAt: -1, product: 1 });
saleSchema.index({ owner: 1, createdAt: -1, totalProfit: 1 });

module.exports = mongoose.model("Sale", saleSchema);