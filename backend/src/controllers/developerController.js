const { PrismaClient } = require("@prisma/client");
const authService = require("../services/auth.service");

const prisma = new PrismaClient();

// Get all buildings (developer only)
const getAllBuildings = async (req, res) => {
  try {
    const buildings = await prisma.buildings.findMany({
      include: {
        admins: {
          select: {
            user_id: true,
            name: true,
            email: true,
            phone_number: true,
          },
        },
        units: {
          select: {
            unit_id: true,
            unit_number: true,
            floor_number: true,
            occupancy_status: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: buildings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create building (developer only)
const createBuilding = async (req, res) => {
  try {
    const { building_name, address, total_floors } = req.body;

    if (!building_name || !total_floors) {
      return res.status(400).json({
        success: false,
        message: "Building name and total floors are required",
      });
    }

    const building = await prisma.buildings.create({
      data: {
        building_name,
        address,
        total_floors: parseInt(total_floors),
      },
    });

    res.status(201).json({
      success: true,
      data: building,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update building (developer only)
const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { building_name, address, total_floors } = req.body;

    const building = await prisma.buildings.update({
      where: { building_id: parseInt(id) },
      data: {
        building_name,
        address,
        total_floors: total_floors ? parseInt(total_floors) : undefined,
      },
    });

    res.status(200).json({
      success: true,
      data: building,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete building (developer only)
const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;

    // First, remove building_id from all admins assigned to this building
    await prisma.users.updateMany({
      where: {
        building_id: parseInt(id),
        role_id: 2, // ADMIN role
      },
      data: {
        building_id: null,
      },
    });

    // Then delete the building
    await prisma.buildings.delete({
      where: { building_id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Building deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create admin account and assign to building (developer only)
const createAdmin = async (req, res) => {
  try {
    const { name, email, phone_number, password, building_id } = req.body;

    if (!name || !email || !phone_number || !password || !building_id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if building exists
    const building = await prisma.buildings.findUnique({
      where: { building_id: parseInt(building_id) },
    });

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

    // Get ADMIN role ID
    const adminRole = await prisma.roles.findUnique({
      where: { role_name: "ADMIN" },
    });

    if (!adminRole) {
      return res.status(404).json({
        success: false,
        message: "Admin role not found",
      });
    }

    // Check if email already exists
    const existingEmail = await prisma.users.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Check if phone number already exists
    const existingPhone = await prisma.users.findUnique({
      where: { phone_number },
    });

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already exists",
      });
    }

    // Hash password
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user account directly (not using authService.registerUser to avoid resident-specific logic)
    const admin = await prisma.users.create({
      data: {
        name,
        email,
        phone_number,
        password: hashedPassword,
        role_id: adminRole.role_id,
        building_id: parseInt(building_id),
      },
      include: {
        building: true,
        role: true,
      },
    });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all admins (developer only)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.users.findMany({
      where: {
        role: {
          role_name: "ADMIN",
        },
      },
      include: {
        building: true,
        role: true,
      },
    });

    // Transform data to only include needed fields
    const transformedAdmins = admins.map(admin => ({
      user_id: admin.user_id,
      name: admin.name,
      email: admin.email,
      phone_number: admin.phone_number,
      is_active: admin.is_active,
      created_at: admin.created_at,
      building: admin.building ? {
        building_id: admin.building.building_id,
        building_name: admin.building.building_name,
        address: admin.building.address,
      } : null,
      role: {
        role_name: admin.role.role_name,
      },
    }));

    res.status(200).json({
      success: true,
      data: transformedAdmins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update admin (developer only)
const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, building_id, is_active } = req.body;

    // Check if admin exists
    const admin = await prisma.users.findUnique({
      where: { user_id: parseInt(id) },
      include: {
        role: true,
      },
    });

    if (!admin || admin.role.role_name !== "ADMIN") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // If building_id is being changed, verify new building exists
    if (building_id && building_id !== admin.building_id) {
      const building = await prisma.buildings.findUnique({
        where: { building_id: parseInt(building_id) },
      });

      if (!building) {
        return res.status(404).json({
          success: false,
          message: "Building not found",
        });
      }
    }

    const updatedAdmin = await prisma.users.update({
      where: { user_id: parseInt(id) },
      data: {
        name,
        email,
        phone_number,
        building_id: building_id ? parseInt(building_id) : undefined,
        is_active: is_active !== undefined ? is_active : undefined,
        updated_at: new Date(),
      },
      include: {
        building: true,
        role: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete admin (developer only)
const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const admin = await prisma.users.findUnique({
      where: { user_id: parseInt(id) },
      include: {
        role: true,
      },
    });

    if (!admin || admin.role.role_name !== "ADMIN") {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    await prisma.users.delete({
      where: { user_id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get developer dashboard stats
const getDeveloperDashboard = async (req, res) => {
  try {
    const totalBuildings = await prisma.buildings.count();
    const totalAdmins = await prisma.users.count({
      where: {
        role: {
          role_name: "ADMIN",
        },
      },
    });
    const totalUnits = await prisma.units.count();
    const totalResidents = await prisma.residents.count();

    res.status(200).json({
      success: true,
      data: {
        totalBuildings,
        totalAdmins,
        totalUnits,
        totalResidents,
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

module.exports = {
  getAllBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getDeveloperDashboard,
};
