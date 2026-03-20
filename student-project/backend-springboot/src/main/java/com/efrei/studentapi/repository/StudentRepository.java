// StudentRepository.java
// Spring Data JPA repository - CRUD operations provided automatically

package com.efrei.studentapi.repository;

import com.efrei.studentapi.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Checks whether a student with the given email already exists.
     * Used to enforce unique email constraint at the service layer.
     */
    boolean existsByEmail(String email);

    /**
     * Checks whether another student (different ID) uses the given email.
     * Used when updating a student to allow keeping the same email.
     */
    boolean existsByEmailAndIdNot(String email, Long id);

    /**
     * Finds a student by email.
     */
    Optional<Student> findByEmail(String email);
}
