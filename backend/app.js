const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ======================== Middlewares ========================
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

// ======================== CORS Setup ========================
const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ======================== Routes ========================

// const authRoutes = require("./services/dailyEarning.service");
// app.use("/", authRoutes);

module.exports = app;
