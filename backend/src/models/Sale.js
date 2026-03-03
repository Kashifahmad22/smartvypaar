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
    // ===============================
    // CORE SALE INFO
    // ===============================

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
    },

    // ===============================
    // CUSTOMER / FINANCIAL
    // ===============================

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
      default: null,
      index: true
    },

    paymentReceived: {
      type: Number,
      default: 0
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIAL", "UNPAID"],
      default: "UNPAID",
      index: true
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "UPI", "BANK", "CARD", "OTHER"],
      default: "CASH"
    },

    // ===============================
    // GST / TAX READY
    // ===============================

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
    }
  },
  { timestamps: true }
);

// ===============================
// PERFORMANCE INDEXES
// ===============================

saleSchema.index({ owner: 1, createdAt: -1 });
saleSchema.index({ owner: 1, product: 1 });
saleSchema.index({ owner: 1, customer: 1 });
saleSchema.index({ owner: 1, paymentStatus: 1 });
saleSchema.index({ owner: 1, createdAt: -1, totalProfit: 1 });

module.exports = mongoose.model("Sale", saleSchema);