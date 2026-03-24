// Controllers/StudentsController.cs
// REST controller exposing CRUD endpoints for /api/students

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentApi.Data;
using StudentApi.Models;

namespace StudentApi.Controllers;

[ApiController]
[Route("api/students")]
[Produces("application/json")]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly ILogger<StudentsController> _logger;

    public StudentsController(ApplicationDbContext db, ILogger<StudentsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    // ─── GET /api/students ───────────────────────────────────────────────────

    /// <summary>Returns the list of all students.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Student>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        _logger.LogInformation("GET /api/students");
        var students = await _db.Students
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
        return Ok(students);
    }

    // ─── GET /api/students/{id} ──────────────────────────────────────────────

    /// <summary>Returns a single student by ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Student), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        _logger.LogInformation("GET /api/students/{Id}", id);
        var student = await _db.Students.FindAsync(id);

        if (student is null)
        {
            _logger.LogWarning("Student id={Id} not found", id);
            return NotFound(new { error = $"Student with id {id} not found." });
        }

        return Ok(student);
    }

    // ─── POST /api/students ──────────────────────────────────────────────────
    // NOTE: Rate limiting applied globally in Program.cs

    /// <summary>Creates a new student.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(Student), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Create([FromBody] Student student)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check for duplicate email
        bool emailExists = await _db.Students.AnyAsync(s => s.Email == student.Email);
        if (emailExists)
        {
            _logger.LogWarning("Email {Email} already in use", student.Email);
            return Conflict(new { error = $"A student with email '{student.Email}' already exists." });
        }

        // Set timestamps
        student.CreatedAt = DateTime.UtcNow;
        student.UpdatedAt = DateTime.UtcNow;

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Student created id={Id}", student.Id);
        return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
    }

    // ─── PUT /api/students/{id} ──────────────────────────────────────────────
    // NOTE: Rate limiting applied globally in Program.cs

    /// <summary>Updates an existing student.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Student), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(int id, [FromBody] Student updated)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var student = await _db.Students.FindAsync(id);
        if (student is null)
        {
            _logger.LogWarning("PUT: Student id={Id} not found", id);
            return NotFound(new { error = $"Student with id {id} not found." });
        }

        // Check email uniqueness only if it changed
        if (updated.Email != student.Email)
        {
            bool emailExists = await _db.Students.AnyAsync(s => s.Email == updated.Email && s.Id != id);
            if (emailExists)
                return Conflict(new { error = $"Email '{updated.Email}' is already used by another student." });
        }

        // Apply updates
        student.FirstName      = updated.FirstName;
        student.LastName       = updated.LastName;
        student.Email          = updated.Email;
        student.Phone          = updated.Phone;
        student.EnrollmentDate = updated.EnrollmentDate;
        student.UpdatedAt      = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        _logger.LogInformation("Student id={Id} updated", id);
        return Ok(student);
    }

    // ─── DELETE /api/students/{id} ───────────────────────────────────────────
    // NOTE: Rate limiting applied globally in Program.cs

    /// <summary>Deletes a student.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _db.Students.FindAsync(id);
        if (student is null)
        {
            _logger.LogWarning("DELETE: Student id={Id} not found", id);
            return NotFound(new { error = $"Student with id {id} not found." });
        }

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();

        _logger.LogInformation("Student id={Id} deleted", id);
        return NoContent();
    }
}
