const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const saleRoutes = require("./routes/saleRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Register routes
app.use("/api/products", productRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SV backend is running 🚀");
});





app.use("/api/sales", saleRoutes);


//For analyticsnpm start


app.use("/api/analytics", analyticsRoutes);


module.exports = app;