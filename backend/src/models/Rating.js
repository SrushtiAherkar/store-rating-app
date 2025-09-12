import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Store } from "./Store.js";

export const Rating = sequelize.define("Rating", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  value: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING(400), allowNull: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  storeId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "ratings",
  timestamps: true
});

// relations
Rating.belongsTo(User, { as: "user", foreignKey: "userId" });
Rating.belongsTo(Store, { as: "store", foreignKey: "storeId" });

User.hasMany(Rating, { as: "ratings", foreignKey: "userId" });
Store.hasMany(Rating, { as: "ratings", foreignKey: "storeId" });
