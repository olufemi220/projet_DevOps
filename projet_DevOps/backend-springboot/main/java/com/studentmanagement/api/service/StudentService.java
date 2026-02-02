package com.studentmanagement.api.service;

import com.studentmanagement.api.dto.StudentDTO;
import com.studentmanagement.api.entity.Student;
import com.studentmanagement.api.exception.ResourceNotFoundException;
import com.studentmanagement.api.exception.DuplicateResourceException;
import com.studentmanagement.api.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    /**
     * Récupère tous les étudiants
     */
    @Transactional(readOnly = true)
    public List<StudentDTO> getAllStudents() {
        log.info("Récupération de tous les étudiants");
        return studentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un étudiant par son ID
     */
    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        log.info("Récupération de l'étudiant avec l'ID: {}", id);
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'ID: " + id));
        return convertToDTO(student);
    }

    /**
     * Crée un nouvel étudiant
     */
    public StudentDTO createStudent(StudentDTO studentDTO) {
        log.info("Création d'un nouvel étudiant: {}", studentDTO.getEmail());
        
        // Vérifier si l'email existe déjà
        if (studentRepository.existsByEmail(studentDTO.getEmail())) {
            throw new DuplicateResourceException("Un étudiant avec cet email existe déjà: " + studentDTO.getEmail());
        }
        
        Student student = convertToEntity(studentDTO);
        Student savedStudent = studentRepository.save(student);
        log.info("Étudiant créé avec succès avec l'ID: {}", savedStudent.getId());
        
        return convertToDTO(savedStudent);
    }

    /**
     * Met à jour un étudiant existant
     */
    public StudentDTO updateStudent(Long id, StudentDTO studentDTO) {
        log.info("Mise à jour de l'étudiant avec l'ID: {}", id);
        
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Étudiant non trouvé avec l'ID: " + id));
        
        // Vérifier si le nouvel email existe déjà pour un autre étudiant
        if (studentRepository.existsByEmailAndIdNot(studentDTO.getEmail(), id)) {
            throw new DuplicateResourceException("Un autre étudiant utilise déjà cet email: " + studentDTO.getEmail());
        }
        
        // Mise à jour des champs
        existingStudent.setFirstName(studentDTO.getFirstName());
        existingStudent.setLastName(studentDTO.getLastName());
        existingStudent.setEmail(studentDTO.getEmail());
        existingStudent.setDateOfBirth(studentDTO.getDateOfBirth());
        existingStudent.setPhoneNumber(studentDTO.getPhoneNumber());
        existingStudent.setAddress(studentDTO.getAddress());
        existingStudent.setCity(studentDTO.getCity());
        existingStudent.setPostalCode(studentDTO.getPostalCode());
        existingStudent.setCountry(studentDTO.getCountry());
        
        Student updatedStudent = studentRepository.save(existingStudent);
        log.info("Étudiant mis à jour avec succès");
        
        return convertToDTO(updatedStudent);
    }

    /**
     * Supprime un étudiant
     */
    public void deleteStudent(Long id) {
        log.info("Suppression de l'étudiant avec l'ID: {}", id);
        
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Étudiant non trouvé avec l'ID: " + id);
        }
        
        studentRepository.deleteById(id);
        log.info("Étudiant supprimé avec succès");
    }

    /**
     * Convertit une entité Student en StudentDTO
     */
    private StudentDTO convertToDTO(Student student) {
        return StudentDTO.builder()
                .id(student.getId())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .email(student.getEmail())
                .dateOfBirth(student.getDateOfBirth())
                .phoneNumber(student.getPhoneNumber())
                .address(student.getAddress())
                .city(student.getCity())
                .postalCode(student.getPostalCode())
                .country(student.getCountry())
                .createdAt(student.getCreatedAt())
                .updatedAt(student.getUpdatedAt())
                .build();
    }

    /**
     * Convertit un StudentDTO en entité Student
     */
    private Student convertToEntity(StudentDTO dto) {
        return Student.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .dateOfBirth(dto.getDateOfBirth())
                .phoneNumber(dto.getPhoneNumber())
                .address(dto.getAddress())
                .city(dto.getCity())
                .postalCode(dto.getPostalCode())
                .country(dto.getCountry())
                .build();
    }
}
