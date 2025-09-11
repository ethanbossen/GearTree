using Microsoft.EntityFrameworkCore;
using GearTree.Models;
using GearTree.Data; // so it knows about GearContext and SeedData
using System.Text.Json.Serialization;
using GearTree.Dtos;


var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Add EF Core + SQLite
builder.Services.AddDbContext<GearContext>(options =>
    options.UseSqlite("Data Source=gear.db"));

// Add OpenAPI for docs
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

app.UseHttpsRedirection();
app.UseCors();
// -------------------------
// Endpoints (DB-backed)
// -------------------------

// Get all amps (DTOs)
app.MapGet("/amps", async (GearContext db) =>
{
    var amps = await db.Amplifiers
        .Include(a => a.Artists)
        .ToListAsync();

    return Results.Ok(amps.Select(a => a.ToDto()));
});


// Get amp by Id
app.MapGet("/amps/{id}", async (int id, GearContext db) =>
{
    var amp = await db.Amplifiers
        .Include(a => a.Artists)
        .FirstOrDefaultAsync(a => a.Id == id);

    return amp is null ? Results.NotFound() : Results.Ok(amp.ToDto());
});

// Get all artists (DTOs)
app.MapGet("/artists", async (GearContext db) =>
{
    var artists = await db.Artists
        .Include(a => a.Amplifiers)
        .Include(a => a.Guitars)
        .ToListAsync();

    return Results.Ok(artists.Select(a => a.ToDto()));
});


// Get artist by Id
app.MapGet("/artists/{id}", async (int id, GearContext db) =>
{
    var artist = await db.Artists
        .Include(a => a.Amplifiers)
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == id);

    return artist is null ? Results.NotFound() : Results.Ok(artist.ToDto());
});

// Get all guitars (DTOs)
app.MapGet("/guitars", async (GearContext db) =>
{
    var guitars = await db.Guitars
        .Include(g => g.Artists)
        .ToListAsync();

    return Results.Ok(guitars.Select(g => g.ToDto()));
});


// Get guitar by Id
app.MapGet("/guitars/{id}", async (int id, GearContext db) =>
{
    var g = await db.Guitars
        .Include(g => g.Artists)
        .FirstOrDefaultAsync(g => g.Id == id);

    return g is null ? Results.NotFound() : Results.Ok(g.ToDto());
});

// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<GearContext>();
    SeedData.Initialize(context);
}

// -------------------------
// Amplifiers CRUD
// -------------------------

// Create (POST)
app.MapPost("/amps", async (Amplifier amp, GearContext db) =>
{
    if (await db.Amplifiers.AnyAsync(a => a.Name == amp.Name))
    {
        return Results.Conflict($"An amplifier with the name '{amp.Name}' already exists.");
    }

    db.Amplifiers.Add(amp);
    await db.SaveChangesAsync();

    var created = await db.Amplifiers
        .Include(a => a.Artists)
        .FirstOrDefaultAsync(a => a.Id == amp.Id);

    return Results.Created($"/amps/{amp.Id}", created!.ToDto());
});

// Update (PUT)
app.MapPut("/amps/{id}", async (int id, Amplifier updatedAmp, GearContext db) =>
{
    var amp = await db.Amplifiers.FindAsync(id);
    if (amp is null) return Results.NotFound();

    amp.Name = updatedAmp.Name;
    amp.PhotoUrl = updatedAmp.PhotoUrl;
    amp.Description = updatedAmp.Description;
    amp.IsTube = updatedAmp.IsTube;
    amp.GainStructure = updatedAmp.GainStructure;
    amp.YearStart = updatedAmp.YearStart;
    amp.YearEnd = updatedAmp.YearEnd;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Delete
app.MapDelete("/amps/{id}", async (int id, GearContext db) =>
{
    var amp = await db.Amplifiers.FindAsync(id);
    if (amp is null) return Results.NotFound();

    db.Amplifiers.Remove(amp);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// -------------------------
// Artists CRUD
// -------------------------

// Create (POST)
app.MapPost("/artists", async (Artist artist, GearContext db) =>
{
    if (await db.Artists.AnyAsync(a => a.Name == artist.Name))
        return Results.Conflict($"An artist with the name '{artist.Name}' already exists.");

    // Resolve amplifiers from DB (if any)
    if (artist.Amplifiers != null && artist.Amplifiers.Any())
    {
        var ampIds = artist.Amplifiers.Select(a => a.Id).ToList();
        artist.Amplifiers = await db.Amplifiers
            .Where(a => ampIds.Contains(a.Id))
            .ToListAsync();
    }

    // Resolve guitars from DB (if any)
    if (artist.Guitars != null && artist.Guitars.Any())
    {
        var guitarIds = artist.Guitars.Select(g => g.Id).ToList();
        artist.Guitars = await db.Guitars
            .Where(g => guitarIds.Contains(g.Id))
            .ToListAsync();
    }

    db.Artists.Add(artist);
    await db.SaveChangesAsync();

    // re-load with includes and return DTO
    var created = await db.Artists
        .Include(a => a.Amplifiers)
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == artist.Id);

    return Results.Created($"/artists/{created!.Id}", created.ToDto());
});

// Update (PUT)
app.MapPut("/artists/{id}", async (int id, Artist updatedArtist, GearContext db) =>
{
    var artist = await db.Artists
        .Include(a => a.Amplifiers)
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == id);

    if (artist is null) return Results.NotFound();

    // Scalars (only overwrite if not null/empty)
    artist.Name = string.IsNullOrWhiteSpace(updatedArtist.Name) ? artist.Name : updatedArtist.Name;
    artist.PhotoUrl = string.IsNullOrWhiteSpace(updatedArtist.PhotoUrl) ? artist.PhotoUrl : updatedArtist.PhotoUrl;
    artist.HeroPhotoUrl = string.IsNullOrWhiteSpace(updatedArtist.HeroPhotoUrl) ? artist.HeroPhotoUrl : updatedArtist.HeroPhotoUrl;
    artist.Tagline = string.IsNullOrWhiteSpace(updatedArtist.Tagline) ? artist.Tagline : updatedArtist.Tagline;
    artist.Description = string.IsNullOrWhiteSpace(updatedArtist.Description) ? artist.Description : updatedArtist.Description;
    artist.Summary = string.IsNullOrWhiteSpace(updatedArtist.Summary) ? artist.Summary : updatedArtist.Summary;

    if (updatedArtist.Bands != null)
        artist.Bands = updatedArtist.Bands;

    if (updatedArtist.OtherPhotos != null)
        artist.OtherPhotos = updatedArtist.OtherPhotos;

    // Amps: null = leave unchanged, [] = clear, non-empty = replace
    if (updatedArtist.Amplifiers != null)
    {
        artist.Amplifiers.Clear();
        if (updatedArtist.Amplifiers.Any())
        {
            var ampIds = updatedArtist.Amplifiers.Select(a => a.Id).ToList();
            var amps = await db.Amplifiers.Where(a => ampIds.Contains(a.Id)).ToListAsync();
            artist.Amplifiers = amps;
        }
    }

    // Guitars: null = leave unchanged, [] = clear, non-empty = replace
    if (updatedArtist.Guitars != null)
    {
        artist.Guitars.Clear();
        if (updatedArtist.Guitars.Any())
        {
            var guitarIds = updatedArtist.Guitars.Select(g => g.Id).ToList();
            var guitars = await db.Guitars.Where(g => guitarIds.Contains(g.Id)).ToListAsync();
            artist.Guitars = guitars;
        }
    }

    await db.SaveChangesAsync();

    // return updated DTO so client sees linked amps/guitars
    var updated = await db.Artists
        .Include(a => a.Amplifiers)
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == id);

    return Results.Ok(updated!.ToDto());
});



// Delete
app.MapDelete("/artists/{id}", async (int id, GearContext db) =>
{
    var artist = await db.Artists.FindAsync(id);
    if (artist is null) return Results.NotFound();

    db.Artists.Remove(artist);
    await db.SaveChangesAsync();
    return Results.NoContent();
});


// -------------------------
// Guitars CRUD
// -------------------------

// Create (POST)
app.MapPost("/guitars", async (Guitar guitar, GearContext db) =>
{
    if (await db.Guitars.AnyAsync(g => g.Name == guitar.Name))
    {
        return Results.Conflict($"A guitar with the name '{guitar.Name}' already exists.");
    }

    db.Guitars.Add(guitar);
    await db.SaveChangesAsync();

    var created = await db.Guitars
        .Include(g => g.Artists)
        .FirstOrDefaultAsync(g => g.Id == guitar.Id);

    return Results.Created($"/guitars/{guitar.Id}", created!.ToDto());
});


// Update (PUT)
app.MapPut("/guitars/{id}", async (int id, Guitar updatedGuitar, GearContext db) =>
{
    var guitar = await db.Guitars.FindAsync(id);
    if (guitar is null) return Results.NotFound();

    guitar.Name = updatedGuitar.Name;
    guitar.PhotoUrl = updatedGuitar.PhotoUrl;
    guitar.Description = updatedGuitar.Description;
    guitar.Type = updatedGuitar.Type;
    guitar.Genres = updatedGuitar.Genres;
    guitar.Pickups = updatedGuitar.Pickups;
    guitar.YearStart = updatedGuitar.YearStart;
    guitar.YearEnd = updatedGuitar.YearEnd;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

// Delete
app.MapDelete("/guitars/{id}", async (int id, GearContext db) =>
{
    var guitar = await db.Guitars.FindAsync(id);
    if (guitar is null) return Results.NotFound();

    db.Guitars.Remove(guitar);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
