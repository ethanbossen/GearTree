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
// UPDATE (PUT) - Scalars only, ignore empty strings
// -------------------------
[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] UpdateGuitarDto updateDto)
{
    var guitar = await _db.Guitars.FirstOrDefaultAsync(g => g.Id == id);

    if (guitar is null) 
        return NotFound();

    // Update scalar properties only if they have meaningful values
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

    if (updateDto.YearEnd.HasValue)
        guitar.YearEnd = updateDto.YearEnd.Value == 0 ? null : updateDto.YearEnd;

    // Collections: only overwrite if non-null and merge.
    if (updateDto.Genres != null && updateDto.Genres.Any())
{
    foreach (var genre in updateDto.Genres)
    {
        if (!guitar.Genres.Contains(genre))
            guitar.Genres.Add(genre);
    }
}

    if (updateDto.Pickups != null && updateDto.Pickups.Any())
{
    foreach (var pickup in updateDto.Pickups)
    {
        if (!guitar.Pickups.Contains(pickup))
            guitar.Pickups.Add(pickup);
    }
}

    // Relationships are untouched: Artists and RelatedGuitars remain as they are

    await _db.SaveChangesAsync();

    // Reload with relationships for return payload
    var updated = await _db.Guitars
        .Include(g => g.Artists)
        .Include(g => g.RelatedGuitars)
        .FirstOrDefaultAsync(g => g.Id == id);

    return Ok(updated!.ToDto());
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
    // PARTIAL UPDATE (PATCH) - Scalars Only
    // -------------------------
    [HttpPatch("{id}")]

    public async Task<IActionResult> PatchScalars(int id, [FromBody] UpdateGuitarDto updateDto)
    {
        var guitar = await _db.Guitars.FirstOrDefaultAsync(g => g.Id == id);

        if (guitar is null) return NotFound();

        // Update scalar properties only if provided
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

        if (updateDto.YearEnd.HasValue)
            guitar.YearEnd = updateDto.YearEnd.Value == 0 ? null : updateDto.YearEnd;

        if (updateDto.Genres != null && updateDto.Genres.Any())
            guitar.Genres ??= new List<string>();
            guitar.Genres.AddRange(updateDto.Genres.Where(g => !guitar.Genres.Contains(g)));

        if (updateDto.Pickups != null && updateDto.Pickups.Any())
            guitar.Pickups ??= new List<string>();
            guitar.Pickups.AddRange(updateDto.Pickups.Where(p => !guitar.Pickups.Contains(p)));

        await _db.SaveChangesAsync();

        // Return the guitar with relationships for consistency in the response
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
