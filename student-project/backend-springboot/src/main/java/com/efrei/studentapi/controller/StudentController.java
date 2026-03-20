// StudentController.java
// REST controller exposing CRUD endpoints for /api/students

package com.efrei.studentapi.controller;

import com.efrei.studentapi.model.Student;
import com.efrei.studentapi.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Students", description = "Student management CRUD operations")
public class StudentController {

    private final StudentService studentService;

    /**
     * GET /api/students
     * Returns the list of all students.
     */
    @GetMapping
    @Operation(summary = "Get all students")
    @ApiResponse(responseCode = "200", description = "List of students returned")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        log.info("GET /api/students → {} students", students.size());
        return ResponseEntity.ok(students);
    }

    /**
     * GET /api/students/{id}
     * Returns a single student by ID.
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get a student by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Student found"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        log.info("GET /api/students/{} → found", id);
        return ResponseEntity.ok(student);
    }

    /**
     * POST /api/students
     * Creates a new student. Returns 201 Created with the student object.
     */
    @PostMapping
    @Operation(summary = "Create a new student")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Student created"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student created = studentService.createStudent(student);
        log.info("POST /api/students → created id={}", created.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/students/{id}
     * Updates an existing student.
     */
    @PutMapping("/{id}")
    @Operation(summary = "Update a student")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Student updated"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "404", description = "Student not found"),
        @ApiResponse(responseCode = "409", description = "Email already in use")
    })
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @RequestBody Student student) {
        Student updated = studentService.updateStudent(id, student);
        log.info("PUT /api/students/{} → updated", id);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/students/{id}
     * Deletes a student. Returns 204 No Content.
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Student deleted"),
        @ApiResponse(responseCode = "404", description = "Student not found")
    })
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        log.info("DELETE /api/students/{} → deleted", id);
        return ResponseEntity.noContent().build();
    }
}
