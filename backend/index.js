const express = require("express");
const app = express();
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const connectDB = require("./config/db");

require("dotenv").config();

// Connect to MongoDB
connectDB();


// CORS FIX
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
