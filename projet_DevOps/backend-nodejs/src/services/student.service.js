const Student = require('../models/student.model');
const logger = require('../utils/logger');

class StudentService {
  /**
   * Récupère tous les étudiants
   */
  async getAllStudents() {
    try {
      logger.info('Service: Récupération de tous les étudiants');
      const students = await Student.findAll({
        order: [['createdAt', 'DESC']]
      });
      return students;
    } catch (error) {
      logger.error('Service: Erreur lors de la récupération des étudiants', error);
      throw error;
    }
  }

  /**
   * Récupère un étudiant par son ID
   */
  async getStudentById(id) {
    try {
      logger.info(`Service: Récupération de l'étudiant avec l'ID: ${id}`);
      const student = await Student.findByPk(id);
      
      if (!student) {
        const error = new Error(`Étudiant non trouvé avec l'ID: ${id}`);
        error.statusCode = 404;
        throw error;
      }
      
      return student;
    } catch (error) {
      logger.error(`Service: Erreur lors de la récupération de l'étudiant ${id}`, error);
      throw error;
    }
  }

  /**
   * Crée un nouvel étudiant
   */
  async createStudent(studentData) {
    try {
      logger.info('Service: Création d\'un nouvel étudiant', { email: studentData.email });
      
      // Vérifier si l'email existe déjà
      const existingStudent = await Student.findOne({ 
        where: { email: studentData.email } 
      });
      
      if (existingStudent) {
        const error = new Error(`Un étudiant avec cet email existe déjà: ${studentData.email}`);
        error.statusCode = 409;
        throw error;
      }
      
      const student = await Student.create(studentData);
      logger.info(`Service: Étudiant créé avec succès avec l'ID: ${student.id}`);
      
      return student;
    } catch (error) {
      logger.error('Service: Erreur lors de la création de l\'étudiant', error);
      throw error;
    }
  }

  /**
   * Met à jour un étudiant existant
   */
  async updateStudent(id, studentData) {
    try {
      logger.info(`Service: Mise à jour de l'étudiant avec l'ID: ${id}`);
      
      const student = await Student.findByPk(id);
      
      if (!student) {
        const error = new Error(`Étudiant non trouvé avec l'ID: ${id}`);
        error.statusCode = 404;
        throw error;
      }
      
      // Vérifier si le nouvel email existe déjà pour un autre étudiant
      if (studentData.email && studentData.email !== student.email) {
        const existingStudent = await Student.findOne({ 
          where: { email: studentData.email } 
        });
        
        if (existingStudent && existingStudent.id !== id) {
          const error = new Error(`Un autre étudiant utilise déjà cet email: ${studentData.email}`);
          error.statusCode = 409;
          throw error;
        }
      }
      
      await student.update(studentData);
      logger.info('Service: Étudiant mis à jour avec succès');
      
      return student;
    } catch (error) {
      logger.error(`Service: Erreur lors de la mise à jour de l'étudiant ${id}`, error);
      throw error;
    }
  }

  /**
   * Supprime un étudiant
   */
  async deleteStudent(id) {
    try {
      logger.info(`Service: Suppression de l'étudiant avec l'ID: ${id}`);
      
      const student = await Student.findByPk(id);
      
      if (!student) {
        const error = new Error(`Étudiant non trouvé avec l'ID: ${id}`);
        error.statusCode = 404;
        throw error;
      }
      
      await student.destroy();
      logger.info('Service: Étudiant supprimé avec succès');
      
      return { message: 'Étudiant supprimé avec succès' };
    } catch (error) {
      logger.error(`Service: Erreur lors de la suppression de l'étudiant ${id}`, error);
      throw error;
    }
  }
}

module.exports = new StudentService();
