import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.AWS_DB_NAME!,
  process.env.AWS_DB_USER!,
  process.env.AWS_DB_PASSWORD!,
  {
    host: process.env.AWS_DB_HOST,
    port: parseInt(process.env.AWS_DB_PORT || "3306"),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
