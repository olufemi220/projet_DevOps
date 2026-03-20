// src/services/students.service.js
// Business logic - raw SQL with mysql2 (no ORM)

const db = require("../config/database");
const logger = require("../config/logger");

/**
 * Returns all students ordered by creation date descending.
 */
const getAllStudents = async () => {
  logger.debug("Service: fetching all students");
  const [rows] = await db.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, email, phone, enrollment_date AS enrollmentDate, created_at AS createdAt, updated_at AS updatedAt FROM students ORDER BY created_at DESC"
  );
  return rows;
};

/**
 * Returns a single student by ID, or null if not found.
 */
const getStudentById = async (id) => {
  logger.debug(`Service: fetching student id=${id}`);
  const [rows] = await db.query(
    "SELECT id, first_name AS firstName, last_name AS lastName, email, phone, enrollment_date AS enrollmentDate, created_at AS createdAt, updated_at AS updatedAt FROM students WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

/**
 * Creates a new student.
 */
const createStudent = async (data) => {
  logger.debug(`Service: creating student email=${data.email}`);
  const { firstName, lastName, email, phone, enrollmentDate } = data;

  const [result] = await db.query(
    "INSERT INTO students (first_name, last_name, email, phone, enrollment_date) VALUES (?, ?, ?, ?, ?)",
    [firstName, lastName, email, phone, enrollmentDate]
  );

  return getStudentById(result.insertId);
};

/**
 * Updates an existing student.
 */
const updateStudent = async (id, data) => {
  logger.debug(`Service: updating student id=${id}`);
  const { firstName, lastName, email, phone, enrollmentDate } = data;

  await db.query(
    "UPDATE students SET first_name=?, last_name=?, email=?, phone=?, enrollment_date=?, updated_at=NOW() WHERE id=?",
    [firstName, lastName, email, phone, enrollmentDate, id]
  );

  return getStudentById(id);
};

/**
 * Deletes a student by ID.
 */
const deleteStudent = async (id) => {
  logger.debug(`Service: deleting student id=${id}`);
  await db.query("DELETE FROM students WHERE id = ?", [id]);
};

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
