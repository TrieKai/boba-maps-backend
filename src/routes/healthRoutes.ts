import { Router } from "express";
import { sequelize } from "../models";
import { redisClient } from "../services/redis";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    // 檢查數據庫連接
    await sequelize.authenticate();

    // 檢查 Redis 連接
    await redisClient.ping();

    res.json({
      header: { status: "success" },
      body: {
        data: {
          status: "healthy",
          database: "connected",
          redis: "connected",
          timestamp: new Date(),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      header: { status: "error" },
      body: {
        data: {
          status: "unhealthy",
          error: error.message,
          timestamp: new Date(),
        },
      },
    });
  }
});

export default router;
