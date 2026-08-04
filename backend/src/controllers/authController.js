const authService = require("../services/auth.service");
const prisma = require("../config/prisma");
const { success, error } = require("../utils/response");

/**
 * Register
 */
const register = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const {
      name,
      email,
      phone_number,
      password,
      role_id,
      flatNumber, // only required when role_id === 2 (Resident)
      building_id, // only required when role_id === 3 (Security)
    } = req.body;

    if (
      !name ||
      !email ||
      !phone_number ||
      !password ||
      !role_id
    ) {
      return error(res, "All fields are required.", 400);
    }

    // Resident accounts must include a flat number
    if (Number(role_id) === 2 && !flatNumber) {
      return error(res, "Flat number is required for resident accounts.", 400);
    }

    // Security accounts must include a building
    if (Number(role_id) === 3 && !building_id) {
      return error(res, "Building is required for security accounts.", 400);
    }

    const result = await authService.registerUser({
      name,
      email,
      phone_number,
      password,
      role_id,
      flatNumber,
      building_id,
    });

    return success(
      res,
      "User registered successfully.",
      result,
      201
    );

  } catch (err) {
    console.error(err);
    return error(res, err.message, 400);
  }
};

/**
 * Login
 */
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, "Email and password are required.", 400);
    }

    const result = await authService.loginUser(
      email,
      password
    );

    // Get building information for the user
    const userWithBuilding = await prisma.users.findUnique({
      where: { user_id: result.user.user_id },
      include: {
        building: true,
        residents: {
          select: {
            building_id: true,
            unit: {
              select: {
                building: true,
              },
            },
          },
        },
      },
    });

    // Add building information to the response
    const buildingInfo = userWithBuilding.building || userWithBuilding.residents?.[0]?.unit?.building || null;

    const responseData = {
      ...result,
      building: buildingInfo ? {
        building_id: buildingInfo.building_id,
        building_name: buildingInfo.building_name,
        address: buildingInfo.address,
      } : null,
    };

    // Activity Log (non-blocking - don't fail login if this fails)
    prisma.activity_logs.create({
      data: {
        user_id: result.user.user_id,
        action: "User Logged In",
      },
    }).catch((err) => {
      console.error("Failed to create activity log:", err);
    });

    return success(
      res,
      "Login successful.",
      responseData
    );

  } catch (err) {
    console.error(err);
    return error(res, err.message, 401);
  }
};

/**
 * Logged-in User Profile
 */
const me = async (req, res) => {

  try {

    const profile = await authService.getProfile(
      req.user.user_id
    );

    return success(
      res,
      "Profile fetched successfully.",
      profile
    );

  } catch (err) {

    console.error(err);

    return error(
      res,
      err.message,
      404
    );

  }

};

/**
 * Update Profile
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Handle multipart form data
    const { name } = req.body;
    const profile_image = req.file?.filename;

    const prisma = require("../config/prisma");

    const updateData = {
      name: name || undefined,
      updated_at: new Date(),
    };

    if (profile_image) {
      // Store only the filename, construct full URL when needed
      updateData.profile_image = `/uploads/${profile_image}`;
    }

    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: updateData,
    });

    return success(
      res,
      "Profile updated successfully.",
      updatedUser
    );
  } catch (err) {
    console.error(err);
    return error(res, err.message, 400);
  }
};

/**
 * Update Email with OTP verification
 */
const updateEmail = async (req, res) => {
  try {
    const { new_email, otp } = req.body;
    const userId = req.user.user_id;

    if (!new_email || !otp) {
      return error(res, "New email and OTP are required.", 400);
    }

    // TODO: Verify OTP (implement OTP verification logic)
    // For now, we'll skip OTP verification and just update
    // In production, you would verify the OTP here

    const prisma = require("../config/prisma");

    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        email: new_email,
        updated_at: new Date(),
      },
    });

    return success(
      res,
      "Email updated successfully.",
      updatedUser
    );
  } catch (err) {
    console.error(err);
    return error(res, err.message, 400);
  }
};

/**
 * Update Phone with OTP verification
 */
const updatePhone = async (req, res) => {
  try {
    const { new_phone, otp } = req.body;
    const userId = req.user.user_id;

    if (!new_phone || !otp) {
      return error(res, "New phone number and OTP are required.", 400);
    }

    // TODO: Verify OTP (implement OTP verification logic)
    // For now, we'll skip OTP verification and just update
    // In production, you would verify the OTP here

    const prisma = require("../config/prisma");

    const updatedUser = await prisma.users.update({
      where: { user_id: userId },
      data: {
        phone_number: new_phone,
        updated_at: new Date(),
      },
    });

    return success(
      res,
      "Phone number updated successfully.",
      updatedUser
    );
  } catch (err) {
    console.error(err);
    return error(res, err.message, 400);
  }
};

/**
 * Change Password with old password verification
 */
const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const userId = req.user.user_id;

    if (!old_password || !new_password) {
      return error(res, "Old password and new password are required.", 400);
    }

    const prisma = require("../config/prisma");

    // Get current user
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
    });

    if (!user) {
      return error(res, "User not found.", 404);
    }

    // Verify old password
    const bcrypt = require("bcrypt");
    const isPasswordValid = await bcrypt.compare(old_password, user.password);

    if (!isPasswordValid) {
      return error(res, "Old password is incorrect.", 401);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await prisma.users.update({
      where: { user_id: userId },
      data: {
        password: hashedPassword,
        updated_at: new Date(),
      },
    });

    return success(
      res,
      "Password changed successfully."
    );
  } catch (err) {
    console.error(err);
    return error(res, err.message, 400);
  }
};

/**
 * Logout
 * JWT is stateless, so the frontend should remove the token.
 */
const logout = async (req, res) => {

  return success(
    res,
    "Logged out successfully."
  );

};

module.exports = {
  register,
  login,
  me,
  logout,
  updateProfile,
  updateEmail,
  updatePhone,
  changePassword,
};