const User = require("../models/User");
const AppError = require("../utils/AppError");

/* ===========================
   GET PROFILE
=========================== */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password"
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);

  } catch (error) {
    next(error);
  }
};


/* ===========================
   UPDATE PROFILE
=========================== */
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      shopName,
      ownerName,
      shopAddress,
      phoneNumber,
      gstNumber
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Update only provided fields
    if (shopName !== undefined) user.shopName = shopName;
    if (ownerName !== undefined) user.ownerName = ownerName;
    if (shopAddress !== undefined) user.shopAddress = shopAddress;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        shopName: user.shopName,
        ownerName: user.ownerName,
        shopAddress: user.shopAddress,
        phoneNumber: user.phoneNumber,
        gstNumber: user.gstNumber,
        businessType: user.businessType,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};