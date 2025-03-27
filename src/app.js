require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const i18next = require("i18next");
const { errorHandler } = require("./middleware/errorHandler");
const { setupDatabase } = require("./config/database");
const { setupRedis } = require("./config/redis");
const { setupPassport } = require("./config/passport");
const { setupI18n } = require("./config/i18n");
const routes = require("./routes");
const specs = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");
const i18nMiddleware = require("./config/i18n");

const app = express();

// Initialize configurations
setupDatabase();
setupRedis();
setupPassport();
setupI18n();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(i18nMiddleware);
app.use(passport.initialize());

// API Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Event Locator API Documentation",
  })
);

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
