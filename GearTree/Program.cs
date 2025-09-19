using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using GearTree.Data;
using GearTree.Models;
using GearTree.Dtos;
using Microsoft.Extensions.FileProviders;

// Parse command line arguments manually
var reseed = false;
var argsList = Environment.GetCommandLineArgs().ToList();

if (argsList.Contains("--reseed") || argsList.Contains("-r"))
{
    reseed = true;
    // Remove the reseed argument to avoid conflicts with WebApplication.CreateBuilder
    argsList.Remove("--reseed");
    argsList.Remove("-r");
}

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = argsList.ToArray()
});

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

app.UseStaticFiles();

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
    
    // Ensure database is created
    context.Database.EnsureCreated();
    
    if (reseed)
    {
        Console.WriteLine("Reseeding database...");
        try
        {
            await SeedData.Initialize(context);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Seeding Failed:" + ex.Message);
        }
        Console.WriteLine("Database reseeding completed.");
    }
    else if (!context.Guitars.Any() && !context.Amplifiers.Any() && !context.Artists.Any())
    {
        Console.WriteLine("Seeding empty database...");

        try {
            await SeedData.Initialize(context);
        } catch (Exception ex) {
            Console.WriteLine("Seeding failed: " + ex.Message);
        }

        Console.WriteLine("Database seeding completed.");
    }
    else
    {
        Console.WriteLine("Database already contains data. Use --reseed flag to reset.");
    }
}

await app.RunAsync();