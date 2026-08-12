require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("../src/routes/authRoutes");
const dashboardRoutes = require("../src/routes/dashboardRoutes");
const residentRoutes = require("../src/routes/residentRoutes");
const flatRoutes = require("../src/routes/flatRoutes");
const complaintRoutes = require("../src/routes/complaintRoutes");
const paymentRoutes = require("../src/routes/paymentRoutes");
const buildingRoutes = require("../src/routes/buildingRoutes");
const visitorRoutes = require("../src/routes/visitorRoutes");
const maintenanceRoutes = require("../src/routes/maintenanceRoutes");
const noticeRoutes = require("../src/routes/noticeRoutes");
const settingRoutes = require("../src/routes/settingRoutes");
const notificationRoutes = require("../src/routes/notificationRoutes");
const adminRoutes = require("../src/routes/adminRoutes");
const developerRoutes = require("../src/routes/developerRoutes");

const app = express();

const allowedOrigins = [
  "https://building-management-wwyj-gu64uvdl0-nest-os.vercel.app",
  "https://building-management-wwyj-nwfefq0ns-nest-os.vercel.app",
  "https://building-management-e2fyr3rgd-nest-os.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "HEAD",
      "PUT",
      "PATCH",
      "POST",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Handle OPTIONS requests explicitly for preflight
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/residents", residentRoutes);
app.use("/api/flats", flatRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/developer", developerRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Building Management System API is running successfully.",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working",
  });
});

module.exports = app;
