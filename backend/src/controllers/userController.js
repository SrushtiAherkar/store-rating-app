import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { validateName, validateEmail, validatePassword, validateAddress } from "../utils/validations.js";

export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const err = validateName(name) || validateEmail(email) || validatePassword(password) || validateAddress(address);
  if (err) return res.status(400).json({ message: err });

  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, address, role: role || "user" });
    return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address } });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUsers = async (req, res) => {
  const { q, role, sortBy = "name", order = "ASC", page = 1, limit = 50 } = req.query;
  const where = {};
  if (role) where.role = role;
  if (q) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { email: { [Op.iLike]: `%${q}%` } },
      { address: { [Op.iLike]: `%${q}%` } }
    ];
  }
  try {
    const users = await User.findAll({
      where,
      attributes: ["id","name","email","address","role","createdAt"],
      order: [[sortBy, order.toUpperCase() === "DESC" ? "DESC" : "ASC"]],
      limit: parseInt(limit),
      offset: (parseInt(page)-1)*parseInt(limit)
    });
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id, { attributes: ["id","name","email","address","role","createdAt"] });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  const err = validatePassword(newPassword);
  if (err) return res.status(400).json({ message: err });

  try {
    const user = await User.findByPk(userId);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Old password incorrect" });
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    return res.json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
