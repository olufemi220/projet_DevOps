// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const studentsRouter = require("./routes/students.routes");
const requestLogger = require("./middlewares/request-logger.middleware");
const { errorHandler, notFoundHandler } = require("./middlewares/error-handler.middleware");
const { generalLimiter, strictLimiter } = require("./middlewares/rate-limit.middleware");

const app = express();

// Security middleware
app.use(helmet()); // Add security headers

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - restrict to specific origins
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000").split(",");
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy: origin not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Logging middleware
app.use(requestLogger);

// Rate limiting middleware - apply general limiter to all routes
app.use(generalLimiter);

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
