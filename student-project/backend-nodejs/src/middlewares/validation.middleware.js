// src/middlewares/validation.middleware.js
const { body, validationResult } = require("express-validator");

const validateCreateStudent = [
  body("firstName").trim().notEmpty().withMessage("First name is required").isLength({ max: 100 }),
  body("lastName").trim().notEmpty().withMessage("Last name is required").isLength({ max: 100 }),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
  body("phone").trim().notEmpty().withMessage("Phone is required").isLength({ max: 20 }),
  body("enrollmentDate").notEmpty().withMessage("Enrollment date is required").isISO8601().withMessage("Invalid date"),
];

const validateUpdateStudent = [
  body("firstName").optional().trim().notEmpty().isLength({ max: 100 }),
  body("lastName").optional().trim().notEmpty().isLength({ max: 100 }),
  body("email").optional().trim().isEmail().withMessage("Invalid email"),
  body("phone").optional().trim().isLength({ max: 20 }),
  body("enrollmentDate").optional().isISO8601().withMessage("Invalid date"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = { validateCreateStudent, validateUpdateStudent, handleValidationErrors };
