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
    // UPDATE (PUT)
    // -------------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Guitar updatedGuitar)
    {
        var guitar = await _db.Guitars
            .Include(g => g.Artists)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (guitar is null) return NotFound();

        // Scalars
        guitar.Name = updatedGuitar.Name;
        guitar.PhotoUrl = updatedGuitar.PhotoUrl;
        guitar.Description = updatedGuitar.Description;
        guitar.Type = updatedGuitar.Type;
        guitar.Genres = updatedGuitar.Genres;
        guitar.Pickups = updatedGuitar.Pickups;
        guitar.YearStart = updatedGuitar.YearStart;
        guitar.YearEnd = updatedGuitar.YearEnd;

        // Artists: null = leave unchanged, [] = clear, non-empty = replace
        if (updatedGuitar.Artists != null)
        {
            guitar.Artists.Clear();
            if (updatedGuitar.Artists.Any())
            {
                var artistIds = updatedGuitar.Artists.Select(a => a.Id).ToList();
                var artists = await _db.Artists.Where(a => artistIds.Contains(a.Id)).ToListAsync();
                guitar.Artists = artists;
            }
        }

        await _db.SaveChangesAsync();
        return Ok(guitar.ToDto());
    }

// -------------------------
// Add an artist to a guitar (symmetric)
// -------------------------
[HttpPost("{guitarId}/artists/{artistId}")]
public async Task<IActionResult> AddArtistToGuitar(int guitarId, int artistId)
{
    var guitar = await _db.Guitars
        .Include(g => g.Artists)
        .FirstOrDefaultAsync(g => g.Id == guitarId);

    var artist = await _db.Artists
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == artistId);

    if (guitar is null) return NotFound($"Guitar {guitarId} not found");
    if (artist is null) return NotFound($"Artist {artistId} not found");

    var updated = false;

    // Add artist to guitar if missing
    if (!guitar.Artists.Any(a => a.Id == artistId))
    {
        guitar.Artists.Add(artist);
        updated = true;
    }

    // Add guitar to artist if missing
    if (!artist.Guitars.Any(g => g.Id == guitarId))
    {
        artist.Guitars.Add(guitar);
        updated = true;
    }

    if (!updated)
        return Conflict("Artist is already linked to this guitar.");

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
    // PARTIAL UPDATE (PATCH)
    // -------------------------
    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(int id, Guitar patchData)
    {
        var guitar = await _db.Guitars
            .Include(g => g.Artists)
            .FirstOrDefaultAsync(g => g.Id == id);

        if (guitar is null) return NotFound();

        // Scalars
        if (!string.IsNullOrWhiteSpace(patchData.Name))
            guitar.Name = patchData.Name;
        if (!string.IsNullOrWhiteSpace(patchData.PhotoUrl))
            guitar.PhotoUrl = patchData.PhotoUrl;
        if (!string.IsNullOrWhiteSpace(patchData.Description))
            guitar.Description = patchData.Description;
        if (!string.IsNullOrWhiteSpace(patchData.Type))
            guitar.Type = patchData.Type;

        if (patchData.YearStart != 0)
            guitar.YearStart = patchData.YearStart;
        if (patchData.YearEnd != 0)
            guitar.YearEnd = patchData.YearEnd;

        if (patchData.Genres != null)
            guitar.Genres = patchData.Genres;

        if (patchData.Pickups != null)
            guitar.Pickups = patchData.Pickups;

        // Artists
        if (patchData.Artists != null)
        {
            guitar.Artists.Clear();
            if (patchData.Artists.Any())
            {
                var artistIds = patchData.Artists.Select(a => a.Id).ToList();
                var artists = await _db.Artists.Where(a => artistIds.Contains(a.Id)).ToListAsync();
                guitar.Artists = artists;
            }
        }

        await _db.SaveChangesAsync();

        var updated = await _db.Guitars
            .Include(g => g.Artists)
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
