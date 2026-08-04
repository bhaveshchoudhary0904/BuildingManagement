const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getMaintenanceRequests = async (req, res) => {
  try {
    // Filter by building if user is not a developer
    let whereClause = {};
    
    if (req.user?.role === "DEVELOPER") {
      whereClause = {};
    } else if (req.user?.building_id) {
      whereClause = { building_id: req.user.building_id };
    } else {
      // If user has no building_id, return empty array
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const requests = await prisma.maintenance_requests.findMany({
      where: whereClause,
    });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMaintenanceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.maintenance_requests.findUnique({
      where: { request_id: parseInt(id) },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Maintenance request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { resident_id, category, description, priority } = req.body;

    // Get resident_id from authenticated user if not provided
    let targetResidentId = resident_id;
    
    if (!targetResidentId && req.user?.resident_id) {
      targetResidentId = req.user.resident_id;
    }
    
    if (!targetResidentId && req.user?.user_id) {
      const resident = await prisma.residents.findFirst({
        where: { user_id: req.user.user_id },
        select: { resident_id: true, building_id: true },
      });
      if (resident) {
        targetResidentId = resident.resident_id;
      }
    }

    if (!targetResidentId) {
      return res.status(400).json({
        success: false,
        message: "Resident ID is required",
      });
    }

    // Get building_id from resident
    const resident = await prisma.residents.findUnique({
      where: { resident_id: parseInt(targetResidentId) },
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

    const request = await prisma.maintenance_requests.create({
      data: {
        resident_id: parseInt(targetResidentId),
        building_id: resident.building_id,
        category,
        description,
        priority: priority || "Medium",
        status: "Pending",
      },
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMaintenanceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const request = await prisma.maintenance_requests.update({
      where: { request_id: parseInt(id) },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMaintenanceRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.maintenance_requests.delete({
      where: { request_id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Maintenance request deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
