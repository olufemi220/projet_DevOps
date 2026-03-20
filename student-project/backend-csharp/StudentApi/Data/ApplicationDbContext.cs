// Data/ApplicationDbContext.cs
// Entity Framework database context

using Microsoft.EntityFrameworkCore;
using StudentApi.Models;

namespace StudentApi.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    // Students table
    public DbSet<Student> Students { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Student>(entity =>
        {
            // Unique constraint on email
            entity.HasIndex(s => s.Email)
                  .IsUnique()
                  .HasDatabaseName("idx_email");

            // Index on enrollment_date for faster queries
            entity.HasIndex(s => s.EnrollmentDate)
                  .HasDatabaseName("idx_enrollment_date");

            // Table uses InnoDB engine (MySQL default)
            entity.ToTable("students");
        });
    }
}
