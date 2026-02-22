const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
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
  stockQuantity: {
    type: Number,
    required: true
  },

  expiryDate: {
  type: Date
},
  reorderThreshold: {
    type: Number,
    required: true
  },
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  required: true,
  index: true
}
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);