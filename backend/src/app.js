const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const residentRoutes = require("./routes/residentRoutes");
const flatRoutes = require("./routes/flatRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const settingRoutes = require("./routes/settingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const developerRoutes = require("./routes/developerRoutes");

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

// Explicitly handle CORS preflight
app.options("*", cors());

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