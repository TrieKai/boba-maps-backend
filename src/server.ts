import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import db from "./config/database";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { apiLimiter } from "./middlewares/rateLimiter";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
app.use("/api/", apiLimiter);

// Routes
app.use("/api", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection
db.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return db.sync();
  })
  .catch((err) => {
    console.error("Unable to connect to database:", err);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
