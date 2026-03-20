// Student.java
// JPA entity representing a student in the database

package com.efrei.studentapi.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "students",
    indexes = {
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_enrollment_date", columnList = "enrollment_date")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 100, message = "First name must be 100 characters or fewer")
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 100, message = "Last name must be 100 characters or fewer")
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email address")
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must be 20 characters or fewer")
    @Column(nullable = false, length = 20)
    private String phone;

    @NotNull(message = "Enrollment date is required")
    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
