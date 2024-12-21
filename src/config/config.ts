import dotenv from "dotenv";

dotenv.config();

export default {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
  database: {
    host: process.env.AWS_DB_HOST,
    port: parseInt(process.env.AWS_DB_PORT || "3306"),
    username: process.env.AWS_DB_USER,
    password: process.env.AWS_DB_PASSWORD,
    database: process.env.AWS_DB_NAME,
    dialect: "mysql",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  google: {
    mapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  },
};
