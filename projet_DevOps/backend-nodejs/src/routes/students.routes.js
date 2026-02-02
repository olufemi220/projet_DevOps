const express = require('express');
const router = express.Router();
const studentController = require('../controllers/students.controller');
const { validateStudent } = require('../middlewares/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API de gestion des étudiants
 */

// GET /api/students - Récupérer tous les étudiants
router.get('/', studentController.getAllStudents);

// GET /api/students/:id - Récupérer un étudiant par ID
router.get('/:id', studentController.getStudentById);

// POST /api/students - Créer un nouvel étudiant
router.post('/', validateStudent, studentController.createStudent);

// PUT /api/students/:id - Mettre à jour un étudiant
router.put('/:id', validateStudent, studentController.updateStudent);

// DELETE /api/students/:id - Supprimer un étudiant
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
