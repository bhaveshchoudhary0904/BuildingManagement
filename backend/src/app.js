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

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Authentication Routes
app.use("/api/auth", authRoutes);

// Dashboard Routes
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
    message: "Building Management System API is running successfully."
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend is working"
  });
});

module.exports = app;