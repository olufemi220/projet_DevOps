// src/config/database.js
// MySQL connection pool using mysql2 (no ORM, no binary dependencies)

const mysql = require("mysql2/promise");
const logger = require("./logger");

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  port:     parseInt(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME     || "StudentManagement_Dev",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection on startup
pool.getConnection()
  .then((conn) => {
    logger.info("Database connection established successfully.");
    conn.release();
  })
  .catch((err) => {
    logger.error(`Database connection failed: ${err.message}`);
  });

module.exports = pool;
