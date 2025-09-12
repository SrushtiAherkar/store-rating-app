// backend/src/models/User.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  // use string to avoid DB enum migration headaches
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: "user" }
}, {
  tableName: "users",
  timestamps: true
});
