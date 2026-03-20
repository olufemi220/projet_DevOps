// src/app.js
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const studentsRouter = require("./routes/students.routes");
const requestLogger = require("./middlewares/request-logger.middleware");
const { errorHandler, notFoundHandler } = require("./middlewares/error-handler.middleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(requestLogger);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "student-management-node-api",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/students", studentsRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
