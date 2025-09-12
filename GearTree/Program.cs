using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using GearTree.Data;
using GearTree.Models;
using GearTree.Dtos;

var builder = WebApplication.CreateBuilder(args);

// -------------------------
// Services
// -------------------------

// JSON options (prevent circular reference issues)
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// EF Core + SQLite
builder.Services.AddDbContext<GearContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("GearDb") 
        ?? "Data Source=gear.db"));

// Controllers
builder.Services.AddControllers();

// OpenAPI (Swagger)
builder.Services.AddOpenApi();

// CORS (allow frontend dev server)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// -------------------------
// App pipeline
// -------------------------
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();

// -------------------------
// Database Seeding
// -------------------------
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<GearContext>();
    SeedData.Initialize(context);
}

app.Run();
