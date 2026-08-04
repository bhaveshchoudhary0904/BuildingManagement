const prisma = require("../config/prisma");

const buildingAccessMiddleware = async (req, res, next) => {
  try {
    // User is already available in req.user from authMiddleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Developers have access to all buildings
    if (user.role === "DEVELOPER") {
      return next();
    }

    // Admins must have a building assigned
    if (user.role === "ADMIN") {
      if (!user.building_id) {
        return res.status(403).json({
          success: false,
          message: "Admin must be assigned to a building",
        });
      }

      // Add building_id to request for use in controllers
      req.userBuildingId = user.building_id;
      return next();
    }

    // Other roles (residents, security) don't need building access control
    // for this middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Filter data by building for admins
const filterByBuilding = (data, buildingId) => {
  if (!Array.isArray(data)) {
    return data;
  }

  return data.filter(item => {
    // Handle different data structures
    if (item.building_id) {
      return item.building_id === buildingId;
    }
    if (item.building && item.building.building_id) {
      return item.building.building_id === buildingId;
    }
    if (item.unit && item.unit.building_id) {
      return item.unit.building_id === buildingId;
    }
    return true; // If no building relation, include by default
  });
};

module.exports = {
  buildingAccessMiddleware,
  filterByBuilding,
};
