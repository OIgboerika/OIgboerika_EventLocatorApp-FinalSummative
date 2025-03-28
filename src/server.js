const initializeApp = require("./app");

// Start the application
initializeApp().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
