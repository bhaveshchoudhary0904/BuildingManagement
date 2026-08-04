const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await prisma.notifications.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notifications.update({
      where: { notification_id: parseInt(id) },
      data: { is_read: true },
    });

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await prisma.notifications.updateMany({
      where: { user_id: parseInt(userId) },
      data: { is_read: true },
    });

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
