using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentApi.Data;
using StudentApi.Models;

namespace StudentApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly ApiDbContext _context;
    public StudentsController(ApiDbContext context) { _context = context; }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Student>>> GetStudents() => await _context.Students.ToListAsync();

    [HttpPost]
    public async Task<ActionResult<Student>> PostStudent(Student student)
    {
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStudents), new { id = student.Id }, student);
    }
}
