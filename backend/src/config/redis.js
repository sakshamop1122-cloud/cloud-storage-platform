const { createClient } = require("redis");
const logger = require("./logger");

let redisClient = null;

const initializeRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    redisClient.on("error", (err) => logger.error("Redis error:", err));
    redisClient.on("connect", () => logger.info("Connected to Redis"));

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client not initialized");
  }
  return redisClient;
};

const setCache = async (key, value, ttl = 3600) => {
  try {
    const client = getRedisClient();
    const serialized = JSON.stringify(value);
    await client.setEx(key, ttl, serialized);
  } catch (error) {
    logger.error("Redis set error:", error);
  }
};

const getCache = async (key) => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error("Redis get error:", error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error("Redis delete error:", error);
  }
};

const clearCache = async (pattern) => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    logger.error("Redis clear cache error:", error);
  }
};

module.exports = {
  initializeRedis,
  getRedisClient,
  setCache,
  getCache,
  deleteCache,
  clearCache,
};
