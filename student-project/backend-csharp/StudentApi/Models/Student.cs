// Models/Student.cs
// Entity representing a student in the database

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace StudentApi.Models;

[Table("students")]
public class Student
{
    // Primary key - auto-incremented
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    // First name - required, max 100 chars
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100, ErrorMessage = "First name must be 100 characters or fewer")]
    [Column("first_name")]
    public string FirstName { get; set; } = string.Empty;

    // Last name - required, max 100 chars
    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100, ErrorMessage = "Last name must be 100 characters or fewer")]
    [Column("last_name")]
    public string LastName { get; set; } = string.Empty;

    // Email - required, unique, max 255 chars
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email must be a valid email address")]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    // Phone - required, max 20 chars
    [Required(ErrorMessage = "Phone is required")]
    [MaxLength(20, ErrorMessage = "Phone must be 20 characters or fewer")]
    public string Phone { get; set; } = string.Empty;

    // Enrollment date - required
    [Required(ErrorMessage = "Enrollment date is required")]
    [Column("enrollment_date")]
    public DateTime EnrollmentDate { get; set; }

    // Timestamps - managed automatically
    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
