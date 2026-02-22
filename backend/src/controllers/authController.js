const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema, loginSchema } = require("../validations/authValidation");
const AppError = require("../utils/AppError");

/* ===========================
   REGISTER
=========================== */
exports.register = async (req, res, next) => {
  try {
    // 🔐 Zod Validation
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      );
    }

    const { shopName, email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    await User.create({
      shopName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    next(error);
  }
};


/* ===========================
   LOGIN
=========================== */
exports.login = async (req, res, next) => {
  try {
    // 🔐 Zod Validation
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new AppError(
        parsed.error.errors[0].message,
        400
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Invalid credentials", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        shopName: user.shopName,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};