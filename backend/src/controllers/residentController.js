const { PrismaClient } = require("@prisma/client");
const authService = require("../services/auth.service");

const prisma = new PrismaClient();

// Get all residents
const getResidents = async (req, res) => {
  try {
    const whereClause = {};
    
    // Filter by building if user is not a developer
    if (req.user?.role === "DEVELOPER") {
      whereClause = {};
    } else if (req.user?.building_id) {
      whereClause.building_id = req.user.building_id;
    } else {
      // If user has no building_id, return empty array
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const residents = await prisma.residents.findMany({
      where: whereClause,
      include: {
        unit: {
          include: {
            building: true,
          },
        },
        user: true,
      },
    });

    // Transform data to include flatNumber and floorNumber for frontend compatibility
    const transformedResidents = residents
      .filter(resident => resident.user !== null) // Filter out residents without users
      .map(resident => ({
        ...resident,
        flatNumber: resident.unit?.unit_number || null,
        floorNumber: resident.unit?.floor_number || null,
        buildingName: resident.unit?.building?.building_name || null,
        name: resident.user?.name || null,
        email: resident.user?.email || null,
        phone: resident.user?.phone_number || null,
        status: resident.user?.is_active !== false ? 'active' : 'inactive',
      }));

    res.status(200).json({
      success: true,
      data: transformedResidents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get resident by user ID
const getResidentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const resident = await prisma.residents.findFirst({
      where: { user_id: parseInt(userId) },
      include: {
        unit: {
          include: {
            building: true,
          },
        },
        user: true,
      },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    res.status(200).json({
      success: true,
      data: resident,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get resident dashboard statistics
const getResidentDashboard = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const resident = await prisma.residents.findFirst({
      where: { user_id: userId },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    const pendingComplaints = await prisma.complaints.count({
      where: {
        resident_id: resident.resident_id,
        status: "Pending",
      },
    });

    const pendingPayments = await prisma.payments.count({
      where: {
        resident_id: resident.resident_id,
        payment_status: "Pending",
      },
    });

    const visitorsToday = await prisma.visitors.count({
      where: {
        resident_id: resident.resident_id,
        check_in: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    });

    const notices = await prisma.notices.count({
      where: {
        building_id: resident.building_id,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        pendingComplaints,
        pendingPayments,
        visitorsToday,
        notices,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create resident (admin only)
const createResident = async (req, res) => {
  try {
    const { name, email, phone_number, password, unit_id, emergency_contact } = req.body;

    if (!name || !email || !phone_number || !password || !unit_id) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, password, and unit are required",
      });
    }

    const parsedUnitId = parseInt(unit_id, 10);
    const unit = await prisma.units.findUnique({
      where: { unit_id: parsedUnitId },
    });

    if (!unit) {
      return res.status(400).json({
        success: false,
        message: "Selected unit was not found",
      });
    }

    const account = await authService.registerUser({
      name,
      email,
      phone_number,
      password,
      role_id: 2,
      flatNumber: unit.unit_number,
    });

    const resident = await prisma.residents.create({
      data: {
        user_id: account.user.user_id,
        unit_id: parsedUnitId,
        building_id: unit.building_id,
        emergency_contact: emergency_contact || null,
        move_in_date: new Date(),
      },
      include: {
        unit: {
          include: {
            building: true,
          },
        },
        user: true,
      },
    });

    res.status(201).json({
      success: true,
      data: resident,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete resident (admin only)
const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;

    const resident = await prisma.residents.findUnique({
      where: { resident_id: parseInt(id) },
    });

    if (!resident) {
      return res.status(404).json({
        success: false,
        message: "Resident not found",
      });
    }

    // Delete resident and associated user
    await prisma.residents.delete({
      where: { resident_id: parseInt(id) },
    });

    // Also delete the user account
    if (resident.user_id) {
      await prisma.users.delete({
        where: { user_id: resident.user_id },
      });
    }

    res.status(200).json({
      success: true,
      message: "Resident deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getResidents,
  getResidentByUserId,
  getResidentDashboard,
  createResident,
  deleteResident,
};