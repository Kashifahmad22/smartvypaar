const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true
    },

    ownerName: {
      type: String,
      trim: true
    },

    shopAddress: {
      type: String,
      trim: true
    },

    phoneNumber: {
      type: String,
      trim: true
    },

    gstNumber: {
      type: String,
      trim: true
    },

    businessType: {
      type: String,
      enum: ["KIRANA"],
      default: "KIRANA"
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);