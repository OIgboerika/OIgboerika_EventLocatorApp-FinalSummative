const Redis = require("ioredis");
require("dotenv").config();

const testConnection = async () => {
  try {
    const redis = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on("connect", () => {
      console.log("Successfully connected to Redis!");
    });

    redis.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    // Test setting a value
    await redis.set("test_key", "test_value");
    console.log("Successfully set test key");

    // Test getting a value
    const value = await redis.get("test_key");
    console.log("Retrieved value:", value);

    // Test deleting a value
    await redis.del("test_key");
    console.log("Successfully deleted test key");

    // Close connection
    await redis.quit();
    console.log("Redis connection closed successfully!");
  } catch (error) {
    console.error("Redis connection failed:", error);
  }
};

testConnection();
