const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getBuildings = async (req, res) => {
  try {
    let buildings;
    
    // For public route (registration), return all buildings
    if (req.path === '/public' || !req.user) {
      buildings = await prisma.buildings.findMany();
    } 
    // Filter by building if user is not a developer
    else if (req.user?.role === "DEVELOPER") {
      buildings = await prisma.buildings.findMany();
    } else if (req.user?.building_id) {
      buildings = await prisma.buildings.findMany({
        where: { building_id: req.user.building_id },
      });
    } else {
      // If user has no building_id, return empty array
      buildings = [];
    }

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

exports.createBuilding = async (req, res) => {
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

exports.getBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const building = await prisma.buildings.findUnique({
      where: { building_id: parseInt(id) },
    });

    if (!building) {
      return res.status(404).json({
        success: false,
        message: "Building not found",
      });
    }

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

exports.updateBuilding = async (req, res) => {
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

exports.deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
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