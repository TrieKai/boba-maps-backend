import Redis from "ioredis";
import logger from "./loggerService";

class CacheService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
    });

    this.client.on("error", (error) => {
      logger.error("Redis Client Error:", error);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Cache Get Error:", error);
      return null;
    }
  }

  async set(key: string, value: any, expireTime?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      if (expireTime) {
        await this.client.setex(key, expireTime, stringValue);
      } else {
        await this.client.set(key, stringValue);
      }
    } catch (error) {
      logger.error("Cache Set Error:", error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error("Cache Delete Error:", error);
    }
  }
}

export default new CacheService();
