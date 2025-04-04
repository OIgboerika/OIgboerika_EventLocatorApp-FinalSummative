const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Locator API",
      version: "1.0.0",
      description: "API documentation for the Event Locator application",
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://oigboerika-eventlocatorapp.onrender.com/api"
            : "http://localhost:3001/api",
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
