package com.studentmanagement.api.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDTO {

    private Long id;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(min = 2, max = 50)
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(min = 2, max = 50)
    private String lastName;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'email doit être valide")
    private String email;

    @NotNull(message = "La date de naissance est obligatoire")
    @Past
    private LocalDate dateOfBirth;

    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$")
    private String phoneNumber;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 200)
    private String address;

    @Size(max = 50)
    private String city;

    @Size(max = 10)
    private String postalCode;

    private String country;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
