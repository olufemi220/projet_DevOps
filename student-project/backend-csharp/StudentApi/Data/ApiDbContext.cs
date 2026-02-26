using Microsoft.EntityFrameworkCore;
using StudentApi.Models;

namespace StudentApi.Data;

// Database context for MySQL connection
public class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options) { }
    public DbSet<Student> Students { get; set; } = null!;
}
