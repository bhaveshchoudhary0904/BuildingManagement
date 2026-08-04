const prisma = require("../config/prisma");

const getFlats = async (req, res) => {
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

    const units = await prisma.units.findMany({
      where: whereClause,
      orderBy: [{ building_id: "asc" }, { floor_number: "asc" }, { unit_number: "asc" }],
    });

    const buildingIds = [...new Set(units.map((u) => u.building_id))];
    const buildings = buildingIds.length
      ? await prisma.buildings.findMany({
          where: { building_id: { in: buildingIds } },
        })
      : [];
    const buildingMap = Object.fromEntries(
      buildings.map((b) => [b.building_id, b])
    );

    const unitIds = units.map((u) => u.unit_id);
    const residents = unitIds.length
      ? await prisma.residents.findMany({
          where: { unit_id: { in: unitIds } },
        })
      : [];

    const userIds = residents.map((r) => r.user_id);
    const users = userIds.length
      ? await prisma.users.findMany({
          where: { user_id: { in: userIds } },
          select: {
            user_id: true,
            name: true,
            email: true,
            phone_number: true,
          },
        })
      : [];
    const userMap = Object.fromEntries(users.map((u) => [u.user_id, u]));
    const residentByUnit = Object.fromEntries(
      residents.map((r) => [r.unit_id, r])
    );

    const data = units.map((unit) => {
      const building = buildingMap[unit.building_id];
      const resident = residentByUnit[unit.unit_id];
      const user = resident ? userMap[resident.user_id] : null;

      return {
        unitId: unit.unit_id,
        unitNumber: unit.unit_number,
        floorNumber: unit.floor_number,
        buildingName: building?.building_name || "—",
        buildingId: unit.building_id,
        occupancyStatus: unit.occupancy_status || "Vacant",
        residentName: user?.name || null,
        residentEmail: user?.email || null,
        residentPhone: user?.phone_number || null,
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Flats Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFlat = async (req, res) => {
  try {
    const { building_id, floor_number, unit_number, occupancy_status } = req.body;

    if (!building_id || !floor_number || !unit_number) {
      return res.status(400).json({
        success: false,
        message: "building_id, floor_number, and unit_number are required",
      });
    }

    const newUnit = await prisma.units.create({
      data: {
        building_id: parseInt(building_id),
        floor_number: parseInt(floor_number),
        unit_number,
        occupancy_status: occupancy_status || "Vacant",
      },
    });

    res.status(201).json({
      success: true,
      data: {
        unitId: newUnit.unit_id,
        unitNumber: newUnit.unit_number,
        floorNumber: newUnit.floor_number,
        buildingId: newUnit.building_id,
        occupancyStatus: newUnit.occupancy_status,
      },
    });
  } catch (error) {
    console.error("Create Flat Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getFlats, createFlat };
