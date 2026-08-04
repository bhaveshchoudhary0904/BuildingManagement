const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.users.findUnique({
      where: {
        user_id: decoded.user_id,
      },
      include: {
        role: true,
        building: true,
        residents: {
          select: {
            resident_id: true,
            building_id: true,
            unit_id: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      role: decoded.role || user.role?.role_name,
      building_id: user.building_id,
      building: user.building,
      building_name: user.building?.building_name || null,
      phone_number: user.phone_number,
      profile_image: user.profile_image,
      is_active: user.is_active,
      resident_id: user.residents?.[0]?.resident_id,
      resident_building_id: user.residents?.[0]?.building_id,
    };

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;