// src/controllers/students.controller.js
const studentsService = require("../services/students.service");
const logger = require("../config/logger");

const getAllStudents = async (req, res, next) => {
  try {
    const students = await studentsService.getAllStudents();
    logger.info(`GET /api/students → ${students.length} students`);
    res.status(200).json(students);
  } catch (error) { next(error); }
};

const getStudentById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID." });

    const student = await studentsService.getStudentById(id);
    if (!student) return res.status(404).json({ error: "Student not found." });

    res.status(200).json(student);
  } catch (error) { next(error); }
};

const createStudent = async (req, res, next) => {
  try {
    const student = await studentsService.createStudent(req.body);
    logger.info(`POST /api/students → created id=${student.id}`);
    res.status(201).json(student);
  } catch (error) {
    // Handle duplicate email (MySQL error 1062)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "A student with this email already exists." });
    }
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID." });

    const existing = await studentsService.getStudentById(id);
    if (!existing) return res.status(404).json({ error: "Student not found." });

    const student = await studentsService.updateStudent(id, req.body);
    res.status(200).json(student);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already used by another student." });
    }
    next(error);
  }
};

const deleteStudent = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID." });

    const existing = await studentsService.getStudentById(id);
    if (!existing) return res.status(404).json({ error: "Student not found." });

    await studentsService.deleteStudent(id);
    res.status(204).send();
  } catch (error) { next(error); }
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
