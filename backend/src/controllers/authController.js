// backend/src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress
} from "../utils/validations.js";

dotenv.config();

export const signup = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  // validate input
  const err =
    validateName(name) ||
    validateEmail(email) ||
    validatePassword(password) ||
    validateAddress(address);
  if (err) return res.status(400).json({ message: err });

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // Only allow 'owner' via public signup besides 'user'
    const userRole = role === "owner" ? "owner" : "user";

    const user = await User.create({
      name,
      email,
      password: hashed,
      address,
      role: userRole
    });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("📥 Login attempt:", email, password);

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ where: { email } });
    console.log("🔍 Found user:", user ? user.toJSON() : null);

    if (!user) return res.status(400).json({ message: "Invalid credentials (no user)" });

    const ok = await bcrypt.compare(password, user.password);
    console.log("🔑 Password match:", ok);

    if (!ok) return res.status(400).json({ message: "Invalid credentials (bad password)" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);

    console.log("✅ Login success for", user.email, "role:", user.role);

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("💥 Login error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
