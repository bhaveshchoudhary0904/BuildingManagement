const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getNotices = async (req, res) => {
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

    const notices = await prisma.notices.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await prisma.notices.findUnique({
      where: { notice_id: parseInt(id) },
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, description, content, status, notice_type, created_by } = req.body;
    
    // Get building_id from authenticated user or request body
    const building_id = req.body.building_id || req.user?.building_id;

    if (!building_id) {
      return res.status(400).json({
        success: false,
        message: "Building ID is required",
      });
    }
    
    const notice = await prisma.notices.create({
      data: {
        building_id: parseInt(building_id),
        title,
        description: description || content || null,
        notice_type: notice_type || null,
        created_by: created_by || req.user?.user_id || null,
      },
    });

    // Get all residents in the same building to send notifications
    const residents = await prisma.residents.findMany({
      where: {
        building_id: parseInt(building_id),
        user_id: { not: null },
      },
      select: {
        user_id: true,
      },
    });

    // Create notification for each resident in the building
    if (residents.length > 0) {
      const notifications = residents.map((resident) => ({
        user_id: resident.user_id,
        building_id: parseInt(building_id),
        title: `New Notice: ${title}`,
        message: description || content || title,
        is_read: false,
      }));

      await prisma.notifications.createMany({
        data: notifications,
      });
    }

    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await prisma.notices.update({
      where: { notice_id: parseInt(id) },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notices.delete({
      where: { notice_id: parseInt(id) },
    });

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
