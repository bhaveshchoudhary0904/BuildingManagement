const prisma = require("../config/prisma");
const QRCode = require('qrcode');

const getPayments = async (req, res) => {
  try {
    // Filter by building if user is not a developer
    let whereClause = {};
    
    if (req.user?.role === "DEVELOPER") {
      whereClause = {};
    } else if (req.user?.building_id) {
      whereClause = { building_id: req.user.building_id };
    } else {
      // If user has no building_id, return empty array
      return res.status(200).json({ success: true, data: [] });
    }

    const payments = await prisma.payments.findMany({
      where: whereClause,
      orderBy: { created_at: "desc" },
    });

    const residentIds = [...new Set(payments.map((p) => p.resident_id))];
    const residents = residentIds.length
      ? await prisma.residents.findMany({
          where: { resident_id: { in: residentIds } },
        })
      : [];

    const userIds = residents.map((r) => r.user_id);
    const unitIds = residents.map((r) => r.unit_id);

    const users = userIds.length
      ? await prisma.users.findMany({
          where: { user_id: { in: userIds } },
          select: { user_id: true, name: true, email: true },
        })
      : [];

    const units = unitIds.length
      ? await prisma.units.findMany({
          where: { unit_id: { in: unitIds } },
          select: { unit_id: true, unit_number: true },
        })
      : [];

    const userMap = Object.fromEntries(users.map((u) => [u.user_id, u]));
    const unitMap = Object.fromEntries(units.map((u) => [u.unit_id, u]));
    const residentMap = Object.fromEntries(
      residents.map((r) => [r.resident_id, r])
    );

    const data = payments.map((p) => {
      const resident = residentMap[p.resident_id];
      const user = resident ? userMap[resident.user_id] : null;
      const unit = resident ? unitMap[resident.unit_id] : null;

      return {
        paymentId: p.payment_id,
        amount: Number(p.amount),
        month: p.month,
        year: p.year,
        status: p.payment_status || "Pending",
        paymentMethod: p.payment_method,
        transactionId: p.transaction_id,
        paymentDate: p.payment_date,
        createdAt: p.created_at,
        billSource: p.bill_source || "resident",
        residentName: user?.name || null,
        flatNumber: unit?.unit_number || null,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Payments Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const { resident_id, amount, month, year, payment_method, transaction_id } = req.body;

    if (!resident_id || amount == null) {
      return res.status(400).json({
        success: false,
        message: "resident_id and amount are required.",
      });
    }

    // Get building_id from resident
    const resident = await prisma.residents.findUnique({
      where: { resident_id: Number(resident_id) },
      select: { building_id: true },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    if (!resident.building_id) {
      return res.status(400).json({
        success: false,
        message: "Resident must be assigned to a building",
      });
    }

    const payment = await prisma.payments.create({
      data: {
        resident_id: Number(resident_id),
        building_id: resident.building_id,
        amount,
        month: month || null,
        year: year ? Number(year) : null,
        payment_method: payment_method || null,
        transaction_id: transaction_id || null,
        payment_status: "Pending",
      },
    });

    res.status(201).json({
      success: true,
      data: { ...payment, amount: Number(payment.amount) },
    });
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentsByResidentId = async (req, res) => {
  try {
    const { residentId } = req.params;
    const payments = await prisma.payments.findMany({
      where: { resident_id: parseInt(residentId) },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate QR code for payment
const generatePaymentQR = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await prisma.payments.findUnique({
      where: { payment_id: parseInt(paymentId) },
      include: {
        resident: {
          include: {
            user: true,
            unit: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // Create payment data for QR code
    const paymentData = {
      paymentId: payment.payment_id,
      amount: Number(payment.amount),
      residentName: payment.resident.user.name,
      flatNumber: payment.resident.unit.unit_number,
      month: payment.month,
      year: payment.year,
      timestamp: new Date().toISOString(),
    };

    // Generate QR code as base64 image
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(paymentData), {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        qrCode: qrCodeDataURL,
        payment: {
          paymentId: payment.payment_id,
          amount: Number(payment.amount),
          month: payment.month,
          year: payment.year,
          status: payment.payment_status,
          residentName: payment.resident.user.name,
          flatNumber: payment.resident.unit.unit_number,
        },
      },
    });
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Confirm payment (simulated - in production this would integrate with payment gateway)
const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { transaction_id, payment_method, upi_id, notes } = req.body;

    const payment = await prisma.payments.findUnique({
      where: { payment_id: parseInt(paymentId) },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (payment.payment_status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed",
      });
    }

    const updatedPayment = await prisma.payments.update({
      where: { payment_id: parseInt(paymentId) },
      data: {
        payment_status: "Paid",
        payment_date: new Date(),
        transaction_id: transaction_id || `TXN${Date.now()}`,
        payment_method: payment_method || "QR Code",
        upi_id: upi_id || null,
        notes: notes || null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: { ...updatedPayment, amount: Number(updatedPayment.amount) },
    });
  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create maintenance bill for resident (by logged-in resident)
const createMaintenanceBill = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    
    console.log("Create Bill - User ID:", userId);
    console.log("Create Bill - Request body:", req.body);
    
    if (!userId) {
      console.log("Create Bill - No user ID found");
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    const resident = await prisma.residents.findUnique({
      where: { user_id: userId },
    });

    console.log("Create Bill - Resident found:", resident);

    if (!resident) {
      console.log("Create Bill - Resident not found for user_id:", userId);
      return res.status(404).json({
        success: false,
        message: "Resident not found. Please ensure you are registered as a resident.",
      });
    }

    const { amount, month, year } = req.body;

    if (!amount || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Amount, month, and year are required",
      });
    }

    // Check if payment already exists for this month/year
    const existingPayment = await prisma.payments.findFirst({
      where: {
        resident_id: resident.resident_id,
        month,
        year: parseInt(year),
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this period",
      });
    }

    if (!resident.building_id) {
      return res.status(400).json({
        success: false,
        message: "Resident must be assigned to a building",
      });
    }

    const payment = await prisma.payments.create({
      data: {
        resident_id: resident.resident_id,
        building_id: resident.building_id,
        amount: parseFloat(amount),
        month,
        year: parseInt(year),
        payment_status: "Pending",
      },
    });

    res.status(201).json({
      success: true,
      message: "Maintenance bill created successfully",
      data: { ...payment, amount: Number(payment.amount) },
    });
  } catch (error) {
    console.error("Create Bill Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create maintenance bill for any resident (admin function)
const createBillForResident = async (req, res) => {
  try {
    const { resident_id, amount, month, year } = req.body;

    console.log("Create Bill for Resident - Request body:", req.body);

    if (!resident_id || !amount || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Resident ID, amount, month, and year are required",
      });
    }

    // Verify resident exists
    const resident = await prisma.residents.findUnique({
      where: { resident_id: parseInt(resident_id) },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    // Check if payment already exists for this month/year
    const existingPayment = await prisma.payments.findFirst({
      where: {
        resident_id: parseInt(resident_id),
        month,
        year: parseInt(year),
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: "Payment already exists for this period",
      });
    }

    if (!resident.building_id) {
      return res.status(400).json({
        success: false,
        message: "Resident must be assigned to a building",
      });
    }

    const payment = await prisma.payments.create({
      data: {
        resident_id: parseInt(resident_id),
        building_id: resident.building_id,
        amount: parseFloat(amount),
        month,
        year: parseInt(year),
        payment_status: "Pending",
        bill_source: "admin",
      },
    });

    res.status(201).json({
      success: true,
      message: "Maintenance bill created successfully",
      data: { ...payment, amount: Number(payment.amount) },
    });
  } catch (error) {
    console.error("Create Bill for Resident Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { 
  getPayments, 
  createPayment, 
  getPaymentsByResidentId,
  generatePaymentQR,
  confirmPayment,
  createMaintenanceBill,
  createBillForResident,
};
