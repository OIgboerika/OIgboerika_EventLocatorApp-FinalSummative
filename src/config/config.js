require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/event-locator",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
  },
};
