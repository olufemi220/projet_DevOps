package com.studentmanagement.api.controller;

import com.studentmanagement.api.dto.StudentDTO;
import com.studentmanagement.api.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Student Management", description = "API pour la gestion des étudiants")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    /**
     * GET /api/students - Récupère tous les étudiants
     */
    @GetMapping
    @Operation(summary = "Récupère tous les étudiants", description = "Retourne la liste de tous les étudiants")
    public ResponseEntity<Map<String, Object>> getAllStudents() {
        log.info("Requête GET - Récupération de tous les étudiants");
        List<StudentDTO> students = studentService.getAllStudents();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", students.size());
        response.put("data", students);
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/students/{id} - Récupère un étudiant par son ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Récupère un étudiant par ID", description = "Retourne les détails d'un étudiant spécifique")
    public ResponseEntity<Map<String, Object>> getStudentById(@PathVariable Long id) {
        log.info("Requête GET - Récupération de l'étudiant avec l'ID: {}", id);
        StudentDTO student = studentService.getStudentById(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", student);
        
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/students - Crée un nouvel étudiant
     */
    @PostMapping
    @Operation(summary = "Crée un nouvel étudiant", description = "Ajoute un nouvel étudiant à la base de données")
    public ResponseEntity<Map<String, Object>> createStudent(@Valid @RequestBody StudentDTO studentDTO) {
        log.info("Requête POST - Création d'un nouvel étudiant");
        StudentDTO createdStudent = studentService.createStudent(studentDTO);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Étudiant créé avec succès");
        response.put("data", createdStudent);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PUT /api/students/{id} - Met à jour un étudiant existant
     */
    @PutMapping("/{id}")
    @Operation(summary = "Met à jour un étudiant", description = "Modifie les informations d'un étudiant existant")
    public ResponseEntity<Map<String, Object>> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody StudentDTO studentDTO) {
        log.info("Requête PUT - Mise à jour de l'étudiant avec l'ID: {}", id);
        StudentDTO updatedStudent = studentService.updateStudent(id, studentDTO);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Étudiant mis à jour avec succès");
        response.put("data", updatedStudent);
        
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /api/students/{id} - Supprime un étudiant
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Supprime un étudiant", description = "Supprime un étudiant de la base de données")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        log.info("Requête DELETE - Suppression de l'étudiant avec l'ID: {}", id);
        studentService.deleteStudent(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Étudiant supprimé avec succès");
        
        return ResponseEntity.ok(response);
    }
}
