import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;
export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  logging: false
});
