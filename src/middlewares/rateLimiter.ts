import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate-limit:",
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 限制每個 IP 15 分鐘內最多 100 個請求
  message: {
    header: { status: "error" },
    body: { data: { error: "Too many requests, please try again later." } },
  },
});

export const searchLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "search-limit:",
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 限制每個 IP 1 分鐘內最多 10 次搜索
  message: {
    header: { status: "error" },
    body: {
      data: { error: "Too many search requests, please try again later." },
    },
  },
});
