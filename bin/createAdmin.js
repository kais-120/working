const bcrypt = require("bcryptjs/dist/bcrypt");
const { Users } = require("../models");

async function createAdmin() {
    try {
    const existing = await Users.findOne({ where: { email: "admin@admin.com" } });
    if (existing) {
      console.warn("⚠️  User already exists.");
      process.exit(1);
    }
    const password = await bcrypt.hash("admin@123", 10);
    await Users.create({
      name: "admin",
      last_name: "admin",
      email: "admin@admin.com",
      password,
      phone:"12345678",
      rule: "admin",
    });

    console.log("Admin user created successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin:", err.message);
    process.exit(1);
  }
}
createAdmin()