// StudentService.java
// Business logic layer for student operations

package com.efrei.studentapi.service;

import com.efrei.studentapi.exception.StudentNotFoundException;
import com.efrei.studentapi.model.Student;
import com.efrei.studentapi.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    /**
     * Returns all students, sorted by creation date descending.
     */
    @Transactional(readOnly = true)
    public List<Student> getAllStudents() {
        log.debug("Service: fetching all students");
        return studentRepository.findAll();
    }

    /**
     * Returns a student by ID, throws StudentNotFoundException if not found.
     */
    @Transactional(readOnly = true)
    public Student getStudentById(Long id) {
        log.debug("Service: fetching student id={}", id);
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
    }

    /**
     * Creates a new student after checking email uniqueness.
     */
    @Transactional
    public Student createStudent(Student student) {
        log.debug("Service: creating student email={}", student.getEmail());

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException(
                "A student with email '" + student.getEmail() + "' already exists."
            );
        }

        Student saved = studentRepository.save(student);
        log.info("Student created with id={}", saved.getId());
        return saved;
    }

    /**
     * Updates an existing student.
     * Only provided fields are updated (partial update).
     */
    @Transactional
    public Student updateStudent(Long id, Student updatedData) {
        log.debug("Service: updating student id={}", id);

        Student existing = getStudentById(id);

        // Check email uniqueness only if email changed
        if (updatedData.getEmail() != null &&
            !updatedData.getEmail().equals(existing.getEmail()) &&
            studentRepository.existsByEmailAndIdNot(updatedData.getEmail(), id)) {
            throw new IllegalArgumentException(
                "Email '" + updatedData.getEmail() + "' is already used by another student."
            );
        }

        // Apply updates
        if (updatedData.getFirstName() != null) existing.setFirstName(updatedData.getFirstName());
        if (updatedData.getLastName() != null)  existing.setLastName(updatedData.getLastName());
        if (updatedData.getEmail() != null)     existing.setEmail(updatedData.getEmail());
        if (updatedData.getPhone() != null)     existing.setPhone(updatedData.getPhone());
        if (updatedData.getEnrollmentDate() != null) existing.setEnrollmentDate(updatedData.getEnrollmentDate());

        Student saved = studentRepository.save(existing);
        log.info("Student id={} updated", id);
        return saved;
    }

    /**
     * Deletes a student by ID.
     */
    @Transactional
    public void deleteStudent(Long id) {
        log.debug("Service: deleting student id={}", id);

        // Verify student exists before deleting
        getStudentById(id);
        studentRepository.deleteById(id);
        log.info("Student id={} deleted", id);
    }
}
