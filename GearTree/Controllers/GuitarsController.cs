using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GearTree.Data;
using GearTree.Models;
using GearTree.Dtos;

[ApiController]
[Route("guitars")]
public class GuitarsController : ControllerBase
{
    private readonly GearContext _db;

    public GuitarsController(GearContext db)
    {
        _db = db;
    }

    // -------------------------
    // GET all
    // -------------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var guitars = await _db.Guitars
            .Include(g => g.Artists)
            .Include(g => g.RelatedGuitars)
            .ToListAsync();

        return Ok(guitars.Select(g => g.ToDto()).ToList());
    }

    // -------------------------
    // GET by id
    // -------------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var guitar = await _db.Guitars
            .Include(g => g.Artists)
            .Include(g => g.RelatedGuitars)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (guitar is null) return NotFound();

        return Ok(guitar.ToDto());
    }

    // -------------------------
    // CREATE (POST)
    // -------------------------
    [HttpPost]
    public async Task<IActionResult> Create(Guitar guitar)
    {
        if (await _db.Guitars.AnyAsync(g => g.Name == guitar.Name))
            return Conflict($"A guitar with the name '{guitar.Name}' already exists.");

        _db.Guitars.Add(guitar);
        await _db.SaveChangesAsync();

        var created = await _db.Guitars
            .Include(g => g.Artists)
            .FirstOrDefaultAsync(g => g.Id == guitar.Id);

        return Created($"/guitars/{guitar.Id}", created!.ToDto());
    }

    // -------------------------
// UPDATE (PUT) - FIXED VERSION
// -------------------------
[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] UpdateGuitarDto updateDto)
{
    var guitar = await _db.Guitars
        .Include(g => g.Artists)
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == id);

    if (guitar is null) return NotFound();

    // Update all properties (not just if provided, since this is a PUT)
    guitar.Name = updateDto.Name;
    guitar.PhotoUrl = updateDto.PhotoUrl;
    guitar.Description = updateDto.Description;
    guitar.Summary = updateDto.Summary;
    guitar.Type = updateDto.Type;
    guitar.YearStart = updateDto.YearStart;
    guitar.YearEnd = updateDto.YearEnd == 0 ? null : updateDto.YearEnd;
    guitar.Genres = updateDto.Genres ?? new List<string>();
    guitar.Pickups = updateDto.Pickups ?? new List<string>();

    // Update artists
    guitar.Artists.Clear();
    if (updateDto.ArtistIds != null && updateDto.ArtistIds.Any())
    {
        var artists = await _db.Artists
            .Where(a => updateDto.ArtistIds.Contains(a.Id))
            .ToListAsync();
        guitar.Artists = artists;
    }

    // Update related guitars (similar to PATCH method above)
    if (updateDto.RelatedIds != null)
    {
        // Remove all existing relations
        foreach (var relatedGuitar in guitar.RelatedGuitars.ToList())
        {
            await _db.Entry(relatedGuitar).Collection(rg => rg.RelatedGuitars).LoadAsync();
            relatedGuitar.RelatedGuitars.Remove(guitar);
        }
        guitar.RelatedGuitars.Clear();

        // Add new relations if any
        if (updateDto.RelatedIds.Any())
        {
            var relatedGuitars = await _db.Guitars
                .Where(g => updateDto.RelatedIds.Contains(g.Id))
                .ToListAsync();

            foreach (var relatedGuitar in relatedGuitars)
            {
                guitar.RelatedGuitars.Add(relatedGuitar);
                await _db.Entry(relatedGuitar).Collection(rg => rg.RelatedGuitars).LoadAsync();
                
                if (!relatedGuitar.RelatedGuitars.Any(g => g.Id == guitar.Id))
                {
                    relatedGuitar.RelatedGuitars.Add(guitar);
                }
            }
        }
    }

    await _db.SaveChangesAsync();

    var updated = await _db.Guitars
        .Include(g => g.Artists)
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == id);

    return Ok(updated!.ToDto());
}

    // -------------------------
    // Add an artist to a guitar
    // -------------------------
    [HttpPost("{guitarId}/artists/{artistId}")]
    public async Task<IActionResult> AddArtistToGuitar(int guitarId, int artistId)
    {
        var guitar = await _db.Guitars
            .Include(g => g.Artists)
            .FirstOrDefaultAsync(g => g.Id == guitarId);

        if (guitar is null) return NotFound($"Guitar {guitarId} not found");

        var artist = await _db.Artists.FindAsync(artistId);
        if (artist is null) return NotFound($"Artist {artistId} not found");

        // prevent duplicates
        if (!guitar.Artists.Any(a => a.Id == artistId))
            guitar.Artists.Add(artist);

        await _db.SaveChangesAsync();

        return Ok(guitar.ToDto());
    }

// -------------------------
// Add a related guitar (symmetric)
// -------------------------
[HttpPost("{guitarId}/related/{relatedId}")]
public async Task<IActionResult> AddRelatedGuitar(int guitarId, int relatedId)
{
    if (guitarId == relatedId)
        return BadRequest("A guitar cannot be related to itself.");

    var guitar = await _db.Guitars
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == guitarId);

    var related = await _db.Guitars
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == relatedId);

    if (guitar == null || related == null)
        return NotFound("Guitar or related guitar not found.");

    // Add both directions if missing
    if (!guitar.RelatedGuitars.Any(g => g.Id == relatedId))
        guitar.RelatedGuitars.Add(related);

    if (!related.RelatedGuitars.Any(g => g.Id == guitarId))
        related.RelatedGuitars.Add(guitar);

    await _db.SaveChangesAsync();
    return Ok(guitar.ToDto());
}

// -------------------------
// Remove a related guitar (symmetric)
// -------------------------
[HttpDelete("{guitarId}/related/{relatedId}")]
public async Task<IActionResult> RemoveRelatedGuitar(int guitarId, int relatedId)
{
    var guitar = await _db.Guitars
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == guitarId);

    var related = await _db.Guitars
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == relatedId);

    if (guitar == null || related == null)
        return NotFound("Guitar or related guitar not found.");

    var removed = false;

    var relatedFromGuitar = guitar.RelatedGuitars.FirstOrDefault(g => g.Id == relatedId);
    if (relatedFromGuitar != null)
    {
        guitar.RelatedGuitars.Remove(relatedFromGuitar);
        removed = true;
    }

    var guitarFromRelated = related.RelatedGuitars.FirstOrDefault(g => g.Id == guitarId);
    if (guitarFromRelated != null)
    {
        related.RelatedGuitars.Remove(guitarFromRelated);
        removed = true;
    }

    if (!removed)
        return NotFound("Relation not found.");

    await _db.SaveChangesAsync();
    return Ok(guitar.ToDto());
}

// -------------------------
// PARTIAL UPDATE (PATCH) - FIXED VERSION
// -------------------------
[HttpPatch("{id}")]
public async Task<IActionResult> Patch(int id, [FromBody] UpdateGuitarDto updateDto)
{
    var guitar = await _db.Guitars
        .Include(g => g.Artists)
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == id);

    if (guitar is null) return NotFound();

    // Update scalar properties if provided
    if (!string.IsNullOrWhiteSpace(updateDto.Name))
        guitar.Name = updateDto.Name;
    if (!string.IsNullOrWhiteSpace(updateDto.PhotoUrl))
        guitar.PhotoUrl = updateDto.PhotoUrl;
    if (!string.IsNullOrWhiteSpace(updateDto.Description))
        guitar.Description = updateDto.Description;
    if (!string.IsNullOrWhiteSpace(updateDto.Summary))
        guitar.Summary = updateDto.Summary;
    if (!string.IsNullOrWhiteSpace(updateDto.Type))
        guitar.Type = updateDto.Type;

    if (updateDto.YearStart != 0)
        guitar.YearStart = updateDto.YearStart;
    
    // Handle YearEnd - convert 0 to null
    if (updateDto.YearEnd.HasValue)
        guitar.YearEnd = updateDto.YearEnd.Value == 0 ? null : updateDto.YearEnd;

    if (updateDto.Genres != null)
        guitar.Genres = updateDto.Genres;

    if (updateDto.Pickups != null)
        guitar.Pickups = updateDto.Pickups;

    // Update artists if ArtistIds is provided
    if (updateDto.ArtistIds != null)
    {
        guitar.Artists.Clear();
        if (updateDto.ArtistIds.Any())
        {
            var artists = await _db.Artists
                .Where(a => updateDto.ArtistIds.Contains(a.Id))
                .ToListAsync();
            guitar.Artists = artists;
        }
    }

    // Update related guitars if RelatedIds is provided
    if (updateDto.RelatedIds != null)
    {
        // First, remove all existing relations
        foreach (var relatedGuitar in guitar.RelatedGuitars.ToList())
        {
            // Load the related guitar's relationships
            await _db.Entry(relatedGuitar).Collection(rg => rg.RelatedGuitars).LoadAsync();
            relatedGuitar.RelatedGuitars.Remove(guitar);
        }
        guitar.RelatedGuitars.Clear();

        // Add new relations if any
        if (updateDto.RelatedIds.Any())
        {
            var relatedGuitars = await _db.Guitars
                .Where(g => updateDto.RelatedIds.Contains(g.Id))
                .ToListAsync();

            foreach (var relatedGuitar in relatedGuitars)
            {
                // Add symmetric relationship
                guitar.RelatedGuitars.Add(relatedGuitar);
                
                // Load the related guitar's relationships
                await _db.Entry(relatedGuitar).Collection(rg => rg.RelatedGuitars).LoadAsync();
                
                // Add the reverse relationship if it doesn't exist
                if (!relatedGuitar.RelatedGuitars.Any(g => g.Id == guitar.Id))
                {
                    relatedGuitar.RelatedGuitars.Add(guitar);
                }
            }
        }
    }

    await _db.SaveChangesAsync();

    // Return the updated guitar with all relationships
    var updated = await _db.Guitars
        .Include(g => g.Artists)
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == id);

    return Ok(updated!.ToDto());
}
    // -------------------------
    // DELETE
    // -------------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var guitar = await _db.Guitars.FindAsync(id);
        if (guitar is null) return NotFound();

        _db.Guitars.Remove(guitar);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
