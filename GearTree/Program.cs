using Microsoft.EntityFrameworkCore;
using GearTree.Models;
using GearTree.Data; // so it knows about GearContext and SeedData

var builder = WebApplication.CreateBuilder(args);

// Add EF Core + SQLite
builder.Services.AddDbContext<GearContext>(options =>
    options.UseSqlite("Data Source=gear.db"));

// Add OpenAPI for docs
builder.Services.AddOpenApi();

var app = builder.Build();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

app.UseHttpsRedirection();

// -------------------------
// Endpoints (DB-backed)
// -------------------------

// Get all amps
app.MapGet("/amps", async (GearContext db) => await db.Amplifiers.ToListAsync());

// Get amp by Id
app.MapGet("/amps/{id}", async (int id, GearContext db) =>
    await db.Amplifiers.FindAsync(id) is Amplifier amp ? Results.Ok(amp) : Results.NotFound());

// Get all artists
app.MapGet("/artists", async (GearContext db) => await db.Artists.ToListAsync());

// Get artist by Id
app.MapGet("/artists/{id}", async (int id, GearContext db) =>
    await db.Artists.FindAsync(id) is Artist artist ? Results.Ok(artist) : Results.NotFound());

// Get all guitars
app.MapGet("/guitars", async (GearContext db) => await db.Guitars.ToListAsync());

// Get guitar by Id
app.MapGet("/guitars/{id}", async (int id, GearContext db) =>
    await db.Guitars.FindAsync(id) is Guitar guitar ? Results.Ok(guitar) : Results.NotFound());

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
    return Results.Created($"/amps/{amp.Id}", amp);
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
    {
        return Results.Conflict($"An artist with the name '{artist.Name}' already exists.");
    }
    db.Artists.Add(artist);
    await db.SaveChangesAsync();
    return Results.Created($"/artists/{artist.Id}", artist);
});

// Update (PUT)
app.MapPut("/artists/{id}", async (int id, Artist updatedArtist, GearContext db) =>
{
    var artist = await db.Artists.FindAsync(id);
    if (artist is null) return Results.NotFound();

    artist.Name = updatedArtist.Name;
    artist.PhotoUrl = updatedArtist.PhotoUrl;
    artist.Description = updatedArtist.Description;
    artist.Bands = updatedArtist.Bands;

    await db.SaveChangesAsync();
    return Results.NoContent();
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
    return Results.Created($"/guitars/{guitar.Id}", guitar);
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
