const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: process.env.NODE_ENV === "development" ? console.log : false,
});

const setupDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log("Database tables synchronized");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  setupDatabase,
};
