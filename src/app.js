require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const { errorHandler } = require("./middleware/errorHandler");
const { setupDatabase } = require("./config/database");
const { setupRedis } = require("./config/redis");
const { setupPassport } = require("./config/passport");
const { setupI18n } = require("./config/i18n");
const routes = require("./routes");
const specs = require("./config/swagger");
const swaggerUi = require("swagger-ui-express");

const app = express();
let server = null;

// Initialize configurations
const initializeApp = async () => {
  try {
    // Setup database
    await setupDatabase();

    // Setup Redis
    await setupRedis();

    // Setup other services
    setupPassport();
    await setupI18n();

    // CORS configuration
    const corsOptions = {
      origin:
        process.env.NODE_ENV === "production"
          ? [
              "https://oigboerika-eventlocatorapp.onrender.com",
              /\.onrender\.com$/,
              "https://oigboerika-eventlocatorapp.onrender.com/api-docs",
            ]
          : [
              "http://localhost:3001",
              "http://localhost:10000",
              "http://localhost:3001/api-docs",
              "http://localhost:3000",
              "http://localhost:3000/api-docs",
              "http://127.0.0.1:3001",
              "http://127.0.0.1:3000",
              "http://127.0.0.1:3001/api-docs",
              "http://127.0.0.1:3000/api-docs",
            ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept-Language"],
      credentials: true,
      optionsSuccessStatus: 200,
    };

    // Middleware
    app.use(cors(corsOptions));
    app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      })
    );
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(passport.initialize());

    // Enable pre-flight requests for all routes
    app.options("*", cors(corsOptions));

    // API Documentation
    const swaggerOptions = {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Event Locator API Documentation",
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true,
      },
    };

    app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, swaggerOptions)
    );

    // Routes
    app.use("/api", routes);

    // Error handling
    app.use(errorHandler);

    // Add a root route handler
    app.get("/", (req, res) => {
      res.redirect("/api-docs");
    });

    // Start server
    const PORT = process.env.PORT || 3000;
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      const isProduction = process.env.NODE_ENV === "production";
      const host = isProduction
        ? process.env.RENDER_EXTERNAL_URL
        : `http://localhost:${PORT}`;
      console.log(`API Documentation available at ${host}/api-docs`);
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Please try a different port or kill the process using this port.`
        );
        process.exit(1);
      } else {
        console.error("Server error:", error);
      }
    });

    // Handle process termination
    const shutdown = () => {
      if (server) {
        console.log("Shutting down server...");
        server.close(() => {
          console.log("Server closed");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    process.on("SIGUSR2", shutdown);

    return app;
  } catch (error) {
    console.error("Failed to initialize app:", error);
    process.exit(1);
  }
};

module.exports = initializeApp;
