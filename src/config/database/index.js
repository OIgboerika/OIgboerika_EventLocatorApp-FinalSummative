const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
});

const setupDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");

    // Sync all models
    await sequelize.sync();
    console.log("Database models synchronized!");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  setupDatabase,
};
