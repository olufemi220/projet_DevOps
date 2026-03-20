// StudentNotFoundException.java
// Thrown when a student with a given ID does not exist

package com.efrei.studentapi.exception;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(Long id) {
        super("Student with id " + id + " not found.");
    }
}
