const Redis = require("ioredis");
require("dotenv").config();

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on("connect", () => {
  console.log("Successfully connected to Redis!");
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

const setupRedis = async () => {
  try {
    // Test the connection
    await redisClient.ping();
    console.log("Redis is ready!");
  } catch (error) {
    console.error("Redis setup failed:", error);
    throw error;
  }
};

module.exports = {
  redisClient,
  setupRedis,
};
