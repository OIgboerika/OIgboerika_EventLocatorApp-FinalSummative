const { sequelize } = require("./index");
const config = require("./config");

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Run migrations
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
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
