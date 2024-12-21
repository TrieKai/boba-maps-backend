import Redis from "ioredis";
import config from "../config/config";
import logger from "../utils/logger";

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on("error", (error) => {
  logger.error("Redis Client Error:", error);
});

redisClient.on("connect", () => {
  logger.info("Redis Client Connected");
});

export default redisClient;
