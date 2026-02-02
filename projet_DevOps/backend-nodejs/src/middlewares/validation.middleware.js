const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const validateStudent = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('Le prénom est obligatoire')
    .isLength({ min: 2, max: 50 }).withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  
  body('lastName')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est obligatoire')
    .isEmail().withMessage('L\'email doit être valide')
    .normalizeEmail(),
  
  body('dateOfBirth')
    .notEmpty().withMessage('La date de naissance est obligatoire')
    .isISO8601().withMessage('La date de naissance doit être valide')
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      if (birthDate >= today) {
        throw new Error('La date de naissance doit être dans le passé');
      }
      return true;
    }),
  
  body('phoneNumber')
    .trim()
    .notEmpty().withMessage('Le numéro de téléphone est obligatoire')
    .matches(/^\+?[0-9]{10,15}$/).withMessage('Le numéro de téléphone n\'est pas valide'),
  
  body('address')
    .trim()
    .notEmpty().withMessage('L\'adresse est obligatoire')
    .isLength({ max: 200 }).withMessage('L\'adresse ne doit pas dépasser 200 caractères'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('La ville ne doit pas dépasser 50 caractères'),
  
  body('postalCode')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('Le code postal ne doit pas dépasser 10 caractères'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Le pays ne doit pas dépasser 50 caractères'),
  
  // Middleware pour traiter les résultats de validation
  (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      logger.warn('Validation échouée', { errors: errors.array() });
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      });
    }
    
    next();
  }
];

module.exports = {
  validateStudent
};
