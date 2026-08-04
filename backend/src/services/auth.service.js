const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { generateToken } = require("../utils/jwt");

/**
 * Login User
 */
const loginUser = async (email, password) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      role: true,
      building: true,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.is_active) {
    throw new Error("Your account has been disabled");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role_id: user.role_id,
      role: user.role?.role_name,
      building_id: user.building_id,
      building: user.building,
      profile_image: user.profile_image,
      is_active: user.is_active,
    },
  };
};

/**
 * Register User
 *
 * For residents (role_id === 2), `flatNumber` (e.g. "A-204") is matched
 * against units.unit_number. A matching residents row is created and
 * linked via unit_id. The unit's occupancy_status is flipped to Occupied.
 *
 * For security (role_id === 3), `building_id` is required to assign them to a specific building.
 *
 * For all other roles, only the users row is created.
 */
const registerUser = async (data) => {
  const {
    name,
    email,
    phone_number,
    password,
    role_id,
    flatNumber, // optional, only used when role_id === 2 (Resident)
    building_id, // optional, only used when role_id === 3 (Security)
  } = data;

  const existingEmail = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const existingPhone = await prisma.users.findUnique({
    where: {
      phone_number,
    },
  });

  if (existingPhone) {
    throw new Error("Phone number already exists");
  }

  const parsedRoleId = Number(role_id);

  // If registering as a Resident, validate the flat before creating anything
  let matchedUnit = null;

  if (parsedRoleId === 2) {
    if (!flatNumber || !flatNumber.trim()) {
      throw new Error("Flat number is required for resident accounts");
    }

    matchedUnit = await prisma.units.findFirst({
      where: {
        unit_number: flatNumber.trim(),
      },
      select: {
        unit_id: true,
        unit_number: true,
        building_id: true,
        occupancy_status: true,
      },
    });

    if (!matchedUnit) {
      throw new Error(
        `Flat "${flatNumber}" was not found. Please check the flat number or contact your admin.`
      );
    }

    if (matchedUnit.occupancy_status === "Occupied") {
      throw new Error(`Flat "${flatNumber}" is already occupied.`);
    }
  }

  // If registering as Security, validate the building before creating anything
  let selectedBuilding = null;

  if (parsedRoleId === 3) {
    if (!building_id) {
      throw new Error("Building is required for security accounts");
    }

    selectedBuilding = await prisma.buildings.findUnique({
      where: {
        building_id: Number(building_id),
      },
      select: {
        building_id: true,
        building_name: true,
      },
    });

    if (!selectedBuilding) {
      throw new Error("Building not found");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Wrap user + resident creation in a transaction so it's all-or-nothing
  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.users.create({
      data: {
        name,
        email,
        phone_number,
        password: hashedPassword,
        role_id: parsedRoleId,
        building_id: selectedBuilding ? selectedBuilding.building_id : null,
      },
    });

    if (parsedRoleId === 2 && matchedUnit) {
      await tx.residents.create({
        data: {
          user_id: createdUser.user_id,
          unit_id: matchedUnit.unit_id,
          building_id: matchedUnit.building_id,
        },
      });

      await tx.units.update({
        where: { unit_id: matchedUnit.unit_id },
        data: { occupancy_status: "Occupied" },
      });
    }

    return createdUser;
  });

  const token = generateToken(user);

  return {
    token,
    user: {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      role_id: user.role_id,
      building_id: user.building_id,
      building: selectedBuilding,
      profile_image: user.profile_image,
      is_active: user.is_active,
      ...(matchedUnit ? { unit_number: matchedUnit.unit_number } : {}),
    },
  };
};

/**
 * Get User Profile
 */
const getProfile = async (userId) => {
  const user = await prisma.users.findUnique({
    where: {
      user_id: userId,
    },
    include: {
      role: true,
      building: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    phone_number: user.phone_number,
    role_id: user.role_id,
    role: user.role?.role_name,
    building_id: user.building_id,
    building: user.building,
    profile_image: user.profile_image,
    is_active: user.is_active,
    created_at: user.created_at,
  };
};

module.exports = {
  loginUser,
  registerUser,
  getProfile,
};