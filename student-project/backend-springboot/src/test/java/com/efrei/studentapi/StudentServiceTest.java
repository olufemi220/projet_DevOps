// StudentServiceTest.java
// Unit tests for StudentService

package com.efrei.studentapi;

import com.efrei.studentapi.exception.StudentNotFoundException;
import com.efrei.studentapi.model.Student;
import com.efrei.studentapi.repository.StudentRepository;
import com.efrei.studentapi.service.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    private Student sampleStudent;

    @BeforeEach
    void setUp() {
        sampleStudent = Student.builder()
                .id(1L)
                .firstName("Alice")
                .lastName("Dupont")
                .email("alice.dupont@efrei.fr")
                .phone("0611223344")
                .enrollmentDate(LocalDate.of(2025, 9, 1))
                .build();
    }

    @Test
    void getAllStudents_shouldReturnList() {
        when(studentRepository.findAll()).thenReturn(List.of(sampleStudent));

        List<Student> result = studentService.getAllStudents();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getEmail()).isEqualTo("alice.dupont@efrei.fr");
    }

    @Test
    void getStudentById_shouldReturnStudent_whenFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));

        Student result = studentService.getStudentById(1L);

        assertThat(result.getId()).isEqualTo(1L);
    }

    @Test
    void getStudentById_shouldThrowNotFound_whenMissing() {
        when(studentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> studentService.getStudentById(99L))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void createStudent_shouldSaveAndReturn() {
        when(studentRepository.existsByEmail(anyString())).thenReturn(false);
        when(studentRepository.save(any())).thenReturn(sampleStudent);

        Student result = studentService.createStudent(sampleStudent);

        assertThat(result.getEmail()).isEqualTo("alice.dupont@efrei.fr");
        verify(studentRepository, times(1)).save(sampleStudent);
    }

    @Test
    void createStudent_shouldThrow_whenEmailExists() {
        when(studentRepository.existsByEmail("alice.dupont@efrei.fr")).thenReturn(true);

        assertThatThrownBy(() -> studentService.createStudent(sampleStudent))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void deleteStudent_shouldCallDelete_whenFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));

        studentService.deleteStudent(1L);

        verify(studentRepository, times(1)).deleteById(1L);
    }
}
