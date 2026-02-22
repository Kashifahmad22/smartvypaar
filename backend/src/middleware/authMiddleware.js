const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Utility: Safe console error
const logError = (message, error) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, error);
  }
};

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check header exists
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing"
      });
    }

    // 2️⃣ Validate Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload"
      });
    }

    // 4️⃣ Fetch user (lean for performance)
    const user = await User.findById(decoded.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();

  } catch (error) {
    logError("Auth Middleware Error:", error);

    return res.status(401).json({
      message: "Unauthorized access"
    });
  }
};