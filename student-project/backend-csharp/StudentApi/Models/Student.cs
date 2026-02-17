using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema; // <--- CETTE LIGNE EST VITALE

namespace StudentApi.Models;

[Table("students")]
public class Student
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("first_name")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [Column("last_name")]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Column("phone")]
    public string? Phone { get; set; }

    [Required]
    [Column("enrollment_date")]
    public DateTime EnrollmentDate { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}