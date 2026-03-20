// src/config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Student Management API - Node.js",
      version: "1.0.0",
      description: "REST API for managing students. EFREI microservices project (Node.js + Express + mysql2).",
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
    components: {
      schemas: {
        Student: {
          type: "object",
          properties: {
            id:             { type: "integer" },
            firstName:      { type: "string" },
            lastName:       { type: "string" },
            email:          { type: "string", format: "email" },
            phone:          { type: "string" },
            enrollmentDate: { type: "string", format: "date-time" },
            createdAt:      { type: "string", format: "date-time" },
            updatedAt:      { type: "string", format: "date-time" },
          },
        },
        StudentInput: {
          type: "object",
          required: ["firstName", "lastName", "email", "phone", "enrollmentDate"],
          properties: {
            firstName:      { type: "string", maxLength: 100 },
            lastName:       { type: "string", maxLength: 100 },
            email:          { type: "string", format: "email" },
            phone:          { type: "string", maxLength: 20 },
            enrollmentDate: { type: "string", format: "date" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
