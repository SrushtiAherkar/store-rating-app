import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sequelize } from "./config/db.js";
import { User } from "./models/User.js";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "System Admin";
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || "Admin HQ";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env before running seed");
  process.exit(1);
}

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected.");

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    let admin = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (admin) {
      // ✅ Update password and role if already exists
      admin.password = hashed;
      admin.role = "admin";
      admin.name = ADMIN_NAME;
      admin.address = ADMIN_ADDRESS;
      await admin.save();
      console.log("🔁 Admin user password reset:", ADMIN_EMAIL);
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashed,
        address: ADMIN_ADDRESS,
        role: "admin"
      });
      console.log("✅ Admin user created:", ADMIN_EMAIL);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
}

seed();
