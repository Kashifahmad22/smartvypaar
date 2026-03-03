const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    batchNumber: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    supplierName: {
      type: String,
      default: "",
    },
    invoiceNumber: {
      type: String,
      default: "",
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
      index: true,
    },

    subcategory: {
      type: String,
      default: "",
    },

    barcode: {
      type: String,
      default: "",
      index: true,
    },

    sku: {
      type: String,
      default: "",
    },

    unit: {
      type: String,
      default: "pcs",
    },

    packageSize: {
      type: String,
      default: "",
    },


    reorderThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    leadTimeDays: {
      type: Number,
      default: 3,
      min: 0
    },
    batches: {
      type: [batchSchema],
      default: [],
    },

    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSoldQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastSoldAt: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Performance indexes
productSchema.index({ owner: 1, name: 1 });
productSchema.index({ owner: 1, category: 1 });
productSchema.index({ owner: 1, barcode: 1 });
productSchema.index({ owner: 1, "batches.expiryDate": 1 });

// Additional performance indexes
productSchema.index({ owner: 1, totalStock: 1 });
productSchema.index({ owner: 1, reorderThreshold: 1 });
productSchema.index({ owner: 1, isActive: 1 });

module.exports = mongoose.model("Product", productSchema);