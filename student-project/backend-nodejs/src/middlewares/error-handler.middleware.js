// src/middlewares/error-handler.middleware.js
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  logger.error(`Error on ${req.method} ${req.originalUrl}: ${err.message}`);
  res.status(500).json({ error: "Internal server error." });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
};

module.exports = { errorHandler, notFoundHandler };
