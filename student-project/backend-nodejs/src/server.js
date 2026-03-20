// src/server.js
require("dotenv").config();
const app = require("./app");
const db = require("./config/database");
const logger = require("./config/logger");

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    // Test DB connection
    await db.getConnection().then(c => { c.release(); });

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
      logger.info(`Swagger: http://localhost:${PORT}/api-docs`);
      logger.info(`Health:  http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error(`Failed to start: ${error.message}`);
    process.exit(1);
  }
};

process.on("SIGINT", async () => { await db.end(); process.exit(0); });
process.on("SIGTERM", async () => { await db.end(); process.exit(0); });

start();
