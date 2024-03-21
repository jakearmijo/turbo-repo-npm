import { createClient } from "redis";
import logger from "../middleware/logger/index.js";

class RedisService {
  public client: any;
  public redisConfig: any;

  constructor() {
    this.client = null;
    this.redisConfig =
      process.env.NODE_ENV === "development"
        ? {
            password: process.env.LOCAL_REDIS_PASSWORD || "",
            host: process.env.LOCAL_REDIS_HOST,
            port:
              typeof process.env.LOCAL_REDIS_PORT === "string"
                ? parseInt(process.env.LOCAL_REDIS_PORT)
                : process.env.LOCAL_REDIS_PORT,
          }
        : {
            password: process.env.REDIS_PASSWORD,
            host: process.env.REDIS_HOST,
            port:
              typeof process.env.REDIS_PORT === "string"
                ? parseInt(process.env.REDIS_PORT)
                : process.env.REDIS_PORT,
          };
  }

  async getClient() {
    if (!this.client || !this.client.isOpen) {
      await this.createAndConnect();
    }
    return this.client;
  }

  async tryHGet(key: string, field: string) {
    try {
      const redisClient = await this.getClient();
      const value = await redisClient.hGet(`${key}`, `${field}`);
      return value;
    } catch (error) {
      logger.error("Error retrieving data from Redis:", error);
      return null;
    }
  }

  async tryHSet(key: string, field: string, value: string) {
    try {
      const redisClient = await this.getClient();
      await redisClient.hSet(`${key}`, `${field}`, value);
      return true;
    } catch (error) {
      logger.error("Error setting data in Redis:", error);
      return false;
    }
  }

  async setEmptyKeyWithTTL(key: string, ttlInSeconds: number) {
    const exists = await this.client.exists(key);
    if (!exists) {
      await this.client.set(key, "");
      await this.client.expire(key, ttlInSeconds);
    } else {
      return;
    }
  }

  async setEmptyHashWithTTL(hashKey: string, ttlInSeconds: number) {
    const exists = await this.client.exists(hashKey);
    if (!exists) {
      await this.client.hSet(hashKey, "", "");
      await this.client.expire(hashKey, ttlInSeconds);
    } else {
      return;
    }
  }

  async createAndConnect() {
    this.client = await createClient({
      password: this.redisConfig.password,
      socket: {
        host: this.redisConfig.host,
        port: this.redisConfig.port,
      },
    });

    logger.info(
      `🗃️ 🗃️  Redis Service connected on port: ${this.redisConfig.port}`,
    );
    return this.client.connect();
  }
}

const redisService = new RedisService();

export default redisService;
