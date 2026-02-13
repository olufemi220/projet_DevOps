const studentService = require('../services/student.service');
const logger = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - dateOfBirth
 *         - phoneNumber
 *         - address
 *       properties:
 *         id:
 *           type: integer
 *           description: ID auto-généré de l'étudiant
 *         firstName:
 *           type: string
 *           description: Prénom de l'étudiant
 *         lastName:
 *           type: string
 *           description: Nom de l'étudiant
 *         email:
 *           type: string
 *           format: email
 *           description: Email de l'étudiant
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date de naissance
 *         phoneNumber:
 *           type: string
 *           description: Numéro de téléphone
 *         address:
 *           type: string
 *           description: Adresse
 *         city:
 *           type: string
 *           description: Ville
 *         postalCode:
 *           type: string
 *           description: Code postal
 *         country:
 *           type: string
 *           description: Pays
 */

class StudentController {
  /**
   * @swagger
   * /api/students:
   *   get:
   *     summary: Récupère tous les étudiants
   *     tags: [Students]
   *     responses:
   *       200:
   *         description: Liste de tous les étudiants
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 count:
   *                   type: integer
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Student'
   */
  async getAllStudents(req, res) {
    try {
      logger.info('Controller: GET /api/students - Récupération de tous les étudiants');
      const students = await studentService.getAllStudents();
      
      res.status(200).json({
        success: true,
        count: students.length,
        data: students
      });
    } catch (error) {
      logger.error('Controller: Erreur lors de la récupération des étudiants', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des étudiants',
        error: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/students/{id}:
   *   get:
   *     summary: Récupère un étudiant par son ID
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de l'étudiant
   *     responses:
   *       200:
   *         description: Détails de l'étudiant
   *       404:
   *         description: Étudiant non trouvé
   */
  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Controller: GET /api/students/${id}`);
      
      const student = await studentService.getStudentById(id);
      
      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      logger.error('Controller: Erreur lors de la récupération de l\'étudiant', error);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/students:
   *   post:
   *     summary: Crée un nouvel étudiant
   *     tags: [Students]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Student'
   *     responses:
   *       201:
   *         description: Étudiant créé avec succès
   *       409:
   *         description: Email déjà existant
   */
  async createStudent(req, res) {
    try {
      logger.info('Controller: POST /api/students - Création d\'un étudiant');
      const student = await studentService.createStudent(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Étudiant créé avec succès',
        data: student
      });
    } catch (error) {
      logger.error('Controller: Erreur lors de la création de l\'étudiant', error);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/students/{id}:
   *   put:
   *     summary: Met à jour un étudiant
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de l'étudiant
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Student'
   *     responses:
   *       200:
   *         description: Étudiant mis à jour avec succès
   *       404:
   *         description: Étudiant non trouvé
   */
  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Controller: PUT /api/students/${id}`);
      
      const student = await studentService.updateStudent(id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Étudiant mis à jour avec succès',
        data: student
      });
    } catch (error) {
      logger.error('Controller: Erreur lors de la mise à jour de l\'étudiant', error);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * @swagger
   * /api/students/{id}:
   *   delete:
   *     summary: Supprime un étudiant
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: integer
   *         required: true
   *         description: ID de l'étudiant
   *     responses:
   *       200:
   *         description: Étudiant supprimé avec succès
   *       404:
   *         description: Étudiant non trouvé
   */
  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      logger.info(`Controller: DELETE /api/students/${id}`);
      
      await studentService.deleteStudent(id);
      
      res.status(200).json({
        success: true,
        message: 'Étudiant supprimé avec succès'
      });
    } catch (error) {
      logger.error('Controller: Erreur lors de la suppression de l\'étudiant', error);
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new StudentController();
