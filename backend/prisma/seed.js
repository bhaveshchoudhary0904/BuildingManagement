const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create roles if they don't exist
  const adminRole = await prisma.roles.upsert({
    where: { role_name: "ADMIN" },
    update: {},
    create: { role_name: "ADMIN" },
  });

  const residentRole = await prisma.roles.upsert({
    where: { role_name: "RESIDENT" },
    update: {},
    create: { role_name: "RESIDENT" },
  });

  const securityRole = await prisma.roles.upsert({
    where: { role_name: "SECURITY" },
    update: {},
    create: { role_name: "SECURITY" },
  });

  const developerRole = await prisma.roles.upsert({
    where: { role_name: "DEVELOPER" },
    update: {},
    create: { role_name: "DEVELOPER" },
  });

  const password = await bcrypt.hash("Admin@123", 10);

  // ----------------------
  // DEVELOPER
  // ----------------------
  await prisma.users.upsert({
    where: {
      email: "developer@bms.com",
    },
    update: {},
    create: {
      name: "System Developer",
      email: "developer@bms.com",
      phone_number: "9876543209",
      password: await bcrypt.hash("Developer@123", 10),
      role_id: developerRole.role_id,
    },
  });

  // ----------------------
  // ADMIN
  // ----------------------
  await prisma.users.upsert({
    where: {
      email: "admin@bms.com",
    },
    update: {},
    create: {
      name: "System Administrator",
      email: "admin@bms.com",
      phone_number: "9876543210",
      password,
      role_id: adminRole.role_id,
    },
  });

  // ----------------------
  // SECURITY
  // ----------------------
  await prisma.users.upsert({
    where: {
      email: "security@bms.com",
    },
    update: {},
    create: {
      name: "Security Officer",
      email: "security@bms.com",
      phone_number: "9876543211",
      password: await bcrypt.hash("Security@123", 10),
      role_id: securityRole.role_id,
    },
  });

  // ----------------------
  // Create a building and units for resident
  // ----------------------
  const building = await prisma.buildings.upsert({
    where: { building_id: 1 },
    update: {},
    create: {
      building_name: "Building A",
      address: "Kharghar, Navi Mumbai",
      total_floors: 5,
    },
  });

  // Create some units
  const unit = await prisma.units.upsert({
    where: { unit_id: 1 },
    update: {},
    create: {
      building_id: building.building_id,
      floor_number: 2,
      unit_number: "A-204",
      occupancy_status: "Vacant",
    },
  });

  // ----------------------
  // RESIDENT
  // ----------------------
  const residentUser = await prisma.users.upsert({
    where: {
      email: "resident@bms.com",
    },
    update: {},
    create: {
      name: "Resident User",
      email: "resident@bms.com",
      phone_number: "9876543212",
      password: await bcrypt.hash("Resident@123", 10),
      role_id: residentRole.role_id,
    },
  });

  // Link resident to unit
  await prisma.residents.upsert({
    where: { resident_id: 1 },
    update: {},
    create: {
      user_id: residentUser.user_id,
      unit_id: unit.unit_id,
      building_id: building.building_id,
      emergency_contact: "9876543213",
      move_in_date: new Date(),
    },
  });

  // Update unit to occupied
  await prisma.units.update({
    where: { unit_id: unit.unit_id },
    data: { occupancy_status: "Occupied" },
  });

  console.log("✅ Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });