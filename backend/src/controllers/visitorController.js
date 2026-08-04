const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getVisitors = async (req, res) => {
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

    const visitors = await prisma.visitors.findMany({
      where: whereClause,
    });

    res.status(200).json({
      success: true,
      data: visitors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await prisma.visitors.findUnique({
      where: { visitor_id: parseInt(id) },
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createVisitor = async (req, res) => {
  try {
    const { resident_id, visitor_name, phone_number, purpose, delivery_type } = req.body;

    let building_id = req.body.building_id;

    // If resident_id is provided, get building_id from resident
    if (resident_id && !building_id) {
      const resident = await prisma.residents.findUnique({
        where: { resident_id: parseInt(resident_id) },
        select: { building_id: true },
      });

      if (resident) {
        building_id = resident.building_id;
      }
    }

    // If still no building_id, try to get from authenticated user
    if (!building_id && req.user?.building_id) {
      building_id = req.user.building_id;
    }

    if (!building_id) {
      return res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
    }

    const visitor = await prisma.visitors.create({
      data: {
        resident_id: resident_id ? parseInt(resident_id) : null,
        building_id: parseInt(building_id),
        visitor_name,
        phone_number,
        purpose,
        delivery_type,
        status: "Approved",
      },
    });

    res.status(201).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await prisma.visitors.update({
      where: { visitor_id: parseInt(id) },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.visitors.delete({
      where: { visitor_id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Visitor deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkInVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await prisma.visitors.update({
      where: { visitor_id: parseInt(id) },
      data: {
        check_in: new Date(),
        status: "Checked_In",
      },
    });

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.checkOutVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const visitor = await prisma.visitors.update({
      where: { visitor_id: parseInt(id) },
      data: {
        check_out: new Date(),
        status: "Checked_Out",
      },
    });

    res.status(200).json({
      success: true,
      data: visitor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVisitorsByResidentId = async (req, res) => {
  try {
    const { residentId } = req.params;
    const visitors = await prisma.visitors.findMany({
      where: { resident_id: parseInt(residentId) },
      orderBy: { check_in: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: visitors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
