using Microsoft.EntityFrameworkCore;
using StudentApi.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Add CORS policy to allow Frontend (Member 1) to access the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
// On active Swagger partout (même en Production dans Docker) pour faciliter les tests
app.UseSwagger();
app.UseSwaggerUI();

// Enable CORS - Must be placed before MapControllers
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

// --- FORCER LA CRÉATION DE LA BASE ET DES TABLES ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApiDbContext>();
        // Crée la base et les tables définies dans ApiDbContext si elles n'existent pas
        context.Database.EnsureCreated();
        Console.WriteLine("--- BASE DE DONNÉES ET TABLES PRÊTES ---");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erreur critique lors de la création de la base : {ex.Message}");
    }
}

app.Run();