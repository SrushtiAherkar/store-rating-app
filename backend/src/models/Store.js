import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Store = sequelize.define("Store", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: true },
  address: { type: DataTypes.STRING(400), allowNull: true },
  ownerId: { type: DataTypes.INTEGER, allowNull: true } // ✅ NEW
}, {
  tableName: "stores",
  timestamps: true
});

// relation: store belongs to user (owner)
Store.belongsTo(User, { as: "owner", foreignKey: "ownerId" });
User.hasMany(Store, { as: "stores", foreignKey: "ownerId" });
