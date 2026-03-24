// src/middlewares/rate-limit.middleware.js
const rateLimit = require("express-rate-limit");
const logger = require("../config/logger");

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "900 seconds",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Don't rate limit health checks
    return req.path === "/health";
  },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 429,
      error: "Too many requests from this IP",
      retryAfter: "900 seconds",
    });
  },
});

/**
 * Strict rate limiter for POST/PUT/DELETE operations
 * 30 requests per 15 minutes per IP
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    status: 429,
    error: "Too many write operations from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Strict rate limit exceeded for IP: ${req.ip}, Method: ${req.method}`);
    res.status(429).json({
      status: 429,
      error: "Too many write operations from this IP",
      retryAfter: "900 seconds",
    });
  },
});

/**
 * Login/Auth rate limiter
 * 5 requests per 15 minutes per IP (if auth is added later)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      status: 429,
      error: "Too many authentication attempts",
      retryAfter: "900 seconds",
    });
  },
});

module.exports = {
  generalLimiter,
  strictLimiter,
  authLimiter,
};
