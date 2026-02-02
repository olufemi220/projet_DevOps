package com.studentmanagement.api.repository;

import com.studentmanagement.api.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    /**
     * Trouve un étudiant par son email
     */
    Optional<Student> findByEmail(String email);
    
    /**
     * Vérifie si un email existe déjà
     */
    boolean existsByEmail(String email);
    
    /**
     * Vérifie si un email existe déjà pour un autre étudiant
     */
    boolean existsByEmailAndIdNot(String email, Long id);
}
