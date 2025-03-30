const { sequelize } = require("./index");
const config = require("./config");

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Run migrations - create tables if they don't exist
    await sequelize.sync({ force: false, alter: false });
    console.log("Database tables synchronized successfully.");
  } catch (error) {
    console.error("Unable to run migrations:", error);
    process.exit(1);
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
