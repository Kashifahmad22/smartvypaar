require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const reorderRoutes = require("./routes/reorderRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const profileRoutes = require("./routes/profileRoutes");
const advancedAnalyticsRoutes = require("./routes/advancedAnalyticsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");


/* ==============================
   ENVIRONMENT VALIDATION
============================== */

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

if (!process.env.FRONTEND_URL && process.env.NODE_ENV === "production") {
  throw new Error("FRONTEND_URL must be defined in production");
}

const app = express();

/* ==============================
   SECURITY MIDDLEWARE
============================== */

// Secure HTTP headers
app.use(helmet());

// CORS (must come before rate limiter)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

app.use(express.json());

/* ==============================
   DATABASE CONNECTION
============================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("MongoDB Connected");
    }
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ==============================
   ROUTES
============================== */

app.get("/", (req, res) => {
  res.send("SV backend is running 🚀");
});

app.use("/api/reorder", reorderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", advancedAnalyticsRoutes);
app.use("/api/insights", insightsRoutes);


/* ==============================
   GLOBAL ERROR HANDLER
============================== */

app.use(errorMiddleware);

module.exports = app;