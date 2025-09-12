// backend/src/listUsers.js
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import { User } from "./models/User.js";

dotenv.config();

async function run() {
  await sequelize.authenticate();
  console.log("Connected to DB ✅");
  const users = await User.findAll();
  console.log("All users in DB:");
  console.log(users.map(u => u.toJSON()));
  process.exit();
}
run();
