// GlobalExceptionHandler.java
// Centralizes exception handling and formats HTTP error responses

package com.efrei.studentapi.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles student not found errors → 404.
     */
    @ExceptionHandler(StudentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(StudentNotFoundException ex) {
        log.warn("Not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Handles bean validation errors (@Valid) → 400 with field details.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = new ArrayList<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.add(Map.of(
                "field", fieldError.getField(),
                "message", fieldError.getDefaultMessage()
            ));
        }
        log.warn("Validation failed: {} errors", errors.size());
        return ResponseEntity.badRequest()
                .body(Map.of("errors", errors));
    }

    /**
     * Handles duplicate email (DB unique constraint) → 409.
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateKey(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "A student with this email already exists."));
    }

    /**
     * Handles illegal argument errors → 400.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", ex.getMessage()));
    }

    /**
     * Fallback for any unhandled exceptions → 500.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
        log.error("Unhandled exception: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error. Please try again later."));
    }
}
