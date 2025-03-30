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
        url: "https://oigboerika-eventlocatorapp.onrender.com/api",
        description: "Production Server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["email", "password", "firstName", "lastName"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              description: "User's password",
            },
            firstName: {
              type: "string",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              description: "User's last name",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
