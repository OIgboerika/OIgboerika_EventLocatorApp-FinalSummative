const { Sequelize } = require("sequelize");
require("dotenv").config();

const testConnection = async () => {
  try {
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

    await sequelize.authenticate();
    console.log("Database connection successful!");

    // Test creating a table
    const Test = sequelize.define("Test", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
    });

    await Test.sync({ force: true });
    console.log("Test table created successfully!");

    // Test inserting data
    await Test.create({ name: "test" });
    console.log("Data inserted successfully!");

    // Test querying data
    const result = await Test.findAll();
    console.log("Query result:", result);

    // Clean up
    await Test.drop();
    console.log("Test table dropped successfully!");

    await sequelize.close();
    console.log("Connection closed successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

testConnection();
