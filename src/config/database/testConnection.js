const mongoose = require("mongoose");
require("dotenv").config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB.");

    // Test creating a collection
    const testCollection = mongoose.connection.collection("test");
    await testCollection.insertOne({ test: "connection successful" });
    console.log("Successfully created and inserted into test collection.");

    // Clean up
    await testCollection.drop();
    console.log("Test collection cleaned up.");

    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

testConnection();
