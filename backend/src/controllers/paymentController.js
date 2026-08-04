const prisma = require("../config/prisma");
const QRCode = require('qrcode');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const MCSService = require("../services/mcsChargeService");

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

    const resident = await prisma.residents.findFirst({
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

// Create maintenance bill for any resident (admin function) - MCS compliant
const createBillForResident = async (req, res) => {
  try {
    const { resident_id, month, year, use_mcs_calculation = true } = req.body;

    console.log("Create Bill for Resident - Request body:", req.body);

    if (!resident_id || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Resident ID, month, and year are required",
      });
    }

    // Verify resident exists
    const resident = await prisma.residents.findUnique({
      where: { resident_id: parseInt(resident_id) },
      include: { unit: true },
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

    // Calculate due date (typically 10th of next month)
    const dueDate = new Date(parseInt(year), new Date(Date.parse(month + " 1")).getMonth() + 1, 10);

    let payment;

    if (use_mcs_calculation) {
      // Use MCS-compliant calculation
      payment = await MCSService.createPaymentWithBreakdown(
        parseInt(resident_id),
        month,
        parseInt(year),
        dueDate
      );
      
      // Update bill source
      payment = await prisma.payments.update({
        where: { payment_id: payment.payment_id },
        data: { bill_source: "admin" },
      });
    } else {
      // Use manual amount (legacy)
      payment = await prisma.payments.create({
        data: {
          resident_id: parseInt(resident_id),
          building_id: resident.building_id,
          amount: parseFloat(amount),
          month,
          year: parseInt(year),
          payment_status: "Pending",
          bill_source: "admin",
          due_date: dueDate,
        },
      });
    }

    // Include charge breakdown in response
    const chargeBreakdown = await prisma.payment_charge_breakdowns.findMany({
      where: { payment_id: payment.payment_id },
    });

    res.status(201).json({
      success: true,
      message: "Maintenance bill created successfully",
      data: { 
        ...payment, 
        amount: Number(payment.amount),
        charge_breakdown: chargeBreakdown
      },
    });
  } catch (error) {
    console.error("Create Bill for Resident Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Razorpay integration - Create order
const createRazorpayOrder = async (req, res) => {
  try {
    const { resident_id, building_id, amount, month, year } = req.body;

    if (!resident_id || !building_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "resident_id, building_id, and amount are required.",
      });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(Number(amount) * 100);

    // Create Razorpay order
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        resident_id: String(resident_id),
        building_id: String(building_id),
        month: month || "",
        year: String(year || ""),
      },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record with Pending status and razorpay_order_id
    const payment = await prisma.payments.create({
      data: {
        resident_id: Number(resident_id),
        building_id: Number(building_id),
        amount: Number(amount),
        month: month || null,
        year: year ? Number(year) : null,
        payment_status: "Pending",
        payment_method: "Razorpay",
        razorpay_order_id: order.id,
      },
    });

    res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        keyId: process.env.RAZORPAY_KEY_ID,
        amount: Number(amount),
        currency: "INR",
        paymentId: payment.payment_id,
      },
    });
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Razorpay integration - Verify payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required.",
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      // Update payment status to Failed
      await prisma.payments.updateMany({
        where: { razorpay_order_id: razorpay_order_id },
        data: {
          payment_status: "Failed",
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
        },
      });

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Update payment status to Paid
    const payment = await prisma.payments.updateMany({
      where: { razorpay_order_id: razorpay_order_id },
      data: {
        payment_status: "Paid",
        payment_date: new Date(),
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        transaction_id: razorpay_payment_id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Razorpay Payment Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Razorpay integration - Webhook handler
const handleRazorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    
    if (!signature) {
      return res.status(400).json({ success: false, message: "Missing signature" });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ success: false, message: "Invalid webhook signature" });
    }

    const event = req.body;
    const { event: eventType, payload } = event;

    if (eventType === "payment.captured") {
      const { payment } = payload;
      const { order_id, id: payment_id } = payment.entity;

      // Update payment status to Paid
      await prisma.payments.updateMany({
        where: { razorpay_order_id: order_id },
        data: {
          payment_status: "Paid",
          payment_date: new Date(),
          razorpay_payment_id: payment_id,
          transaction_id: payment_id,
        },
      });
    } else if (eventType === "payment.failed") {
      const { payment } = payload;
      const { order_id, id: payment_id } = payment.entity;

      // Update payment status to Failed
      await prisma.payments.updateMany({
        where: { razorpay_order_id: order_id },
        data: {
          payment_status: "Failed",
          razorpay_payment_id: payment_id,
        },
      });
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Razorpay Webhook Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment charge breakdown
const getPaymentBreakdown = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await prisma.payments.findUnique({
      where: { payment_id: parseInt(paymentId) },
      include: {
        charge_breakdowns: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        payment: {
          payment_id: payment.payment_id,
          amount: Number(payment.amount),
          month: payment.month,
          year: payment.year,
          payment_status: payment.payment_status,
          due_date: payment.due_date,
          is_late: payment.is_late,
        },
        charge_breakdown: payment.charge_breakdowns.map(charge => ({
          charge_type: charge.charge_type,
          charge_name: charge.charge_name,
          amount: Number(charge.amount),
          calculation_basis: charge.calculation_basis,
        })),
      },
    });
  } catch (error) {
    console.error("Get Payment Breakdown Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update building MCS configuration
const updateBuildingMCSConfig = async (req, res) => {
  try {
    const { building_id } = req.params;
    const config = req.body;

    const updatedBuilding = await MCSService.updateBuildingMCSConfig(
      parseInt(building_id),
      config
    );

    res.status(200).json({
      success: true,
      message: "Building MCS configuration updated successfully",
      data: updatedBuilding,
    });
  } catch (error) {
    console.error("Update Building MCS Config Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Calculate charges preview (without creating payment)
const calculateChargesPreview = async (req, res) => {
  try {
    const { resident_id, month, year } = req.body;

    if (!resident_id || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "Resident ID, month, and year are required",
      });
    }

    const calculation = await MCSService.calculateMonthlyCharges(
      parseInt(resident_id),
      month,
      parseInt(year)
    );

    res.status(200).json({
      success: true,
      data: calculation,
    });
  } catch (error) {
    console.error("Calculate Charges Preview Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Apply late payment interest to overdue payments
const applyLatePaymentInterest = async (req, res) => {
  try {
    const { payment_id } = req.params;

    const payment = await prisma.payments.findUnique({
      where: { payment_id: parseInt(payment_id) },
      include: { building: true },
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
        message: "Cannot apply interest to paid payments",
      });
    }

    if (!payment.due_date) {
      return res.status(400).json({
        success: false,
        message: "Payment has no due date set",
      });
    }

    const today = new Date();
    const dueDate = new Date(payment.due_date);

    if (today <= dueDate) {
      return res.status(400).json({
        success: false,
        message: "Payment is not yet overdue",
      });
    }

    // Calculate days late
    const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));

    // Calculate interest using MCS service (max 12% per annum)
    const interestAmount = MCSService.calculateLatePaymentInterest(
      Number(payment.amount),
      daysLate,
      Number(payment.building?.late_payment_interest_rate || 12)
    );

    // Update payment with interest
    const updatedPayment = await prisma.payments.update({
      where: { payment_id: parseInt(payment_id) },
      data: {
        interest_on_dues: interestAmount,
        amount: Number(payment.amount) + interestAmount,
        is_late: true,
      },
    });

    // Add interest as a charge breakdown
    if (interestAmount > 0) {
      await prisma.payment_charge_breakdowns.create({
        data: {
          payment_id: parseInt(payment_id),
          charge_type: "interest_on_dues",
          charge_name: "Late Payment Interest",
          amount: interestAmount,
          calculation_basis: `${daysLate} days late at ${payment.building?.late_payment_interest_rate || 12}% per annum (simple interest)`,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Late payment interest applied successfully",
      data: {
        ...updatedPayment,
        amount: Number(updatedPayment.amount),
        interest_applied: interestAmount,
        days_late: daysLate,
      },
    });
  } catch (error) {
    console.error("Apply Late Payment Interest Error:", error);
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
  createRazorpayOrder,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
  getPaymentBreakdown,
  updateBuildingMCSConfig,
  calculateChargesPreview,
  applyLatePaymentInterest,
};
