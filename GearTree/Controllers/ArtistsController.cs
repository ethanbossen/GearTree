using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GearTree.Data;
using GearTree.Dtos;
using GearTree.Models;

[ApiController]
[Route("artists")]
public class ArtistsController : ControllerBase
{
    private readonly GearContext _db;

    public ArtistsController(GearContext db)
    {
        _db = db;
    }

    // -------------------------
    // GET all
    // -------------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var artists = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .ToListAsync();

        return Ok(artists.Select(a => a.ToDto()).ToList());
    }

    // -------------------------
    // GET by id
    // -------------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var artist = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (artist is null) return NotFound();

        return Ok(artist.ToDto());
    }

    // -------------------------
    // CREATE (POST)
    // -------------------------
    [HttpPost]
    public async Task<IActionResult> Create(Artist artist)
    {
        if (await _db.Artists.AnyAsync(a => a.Name == artist.Name))
            return Conflict($"An artist with the name '{artist.Name}' already exists.");

        // Resolve amps
        if (artist.Amplifiers != null && artist.Amplifiers.Any())
        {
            var ampIds = artist.Amplifiers.Select(a => a.Id).ToList();
            artist.Amplifiers = await _db.Amplifiers
                .Where(a => ampIds.Contains(a.Id))
                .ToListAsync();
        }

        // Resolve guitars
        if (artist.Guitars != null && artist.Guitars.Any())
        {
            var guitarIds = artist.Guitars.Select(g => g.Id).ToList();
            artist.Guitars = await _db.Guitars
                .Where(g => guitarIds.Contains(g.Id))
                .ToListAsync();
        }

        _db.Artists.Add(artist);
        await _db.SaveChangesAsync();

        var created = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == artist.Id);

        return Created($"/artists/{created!.Id}", created.ToDto());
    }

    // -------------------------
    // UPDATE (PUT)
    // -------------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Artist updatedArtist)
    {
        var artist = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (artist is null) return NotFound();

        // Scalars
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

        // Replace amps
        if (updatedArtist.Amplifiers != null)
        {
            artist.Amplifiers.Clear();
            if (updatedArtist.Amplifiers.Any())
            {
                var ampIds = updatedArtist.Amplifiers.Select(a => a.Id).ToList();
                var amps = await _db.Amplifiers.Where(a => ampIds.Contains(a.Id)).ToListAsync();
                artist.Amplifiers = amps;
            }
        }

        // Replace guitars
        if (updatedArtist.Guitars != null)
        {
            artist.Guitars.Clear();
            if (updatedArtist.Guitars.Any())
            {
                var guitarIds = updatedArtist.Guitars.Select(g => g.Id).ToList();
                var guitars = await _db.Guitars.Where(g => guitarIds.Contains(g.Id)).ToListAsync();
                artist.Guitars = guitars;
            }
        }

        await _db.SaveChangesAsync();

        var updated = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == id);

        return Ok(updated!.ToDto());
    }

    // -------------------------
    // PARTIAL UPDATE (PATCH)
    // -------------------------
    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(int id, Artist patchData)
    {
        var artist = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (artist is null) return NotFound();

        // Scalars
        if (!string.IsNullOrWhiteSpace(patchData.Name))
            artist.Name = patchData.Name;
        if (!string.IsNullOrWhiteSpace(patchData.PhotoUrl))
            artist.PhotoUrl = patchData.PhotoUrl;
        if (!string.IsNullOrWhiteSpace(patchData.HeroPhotoUrl))
            artist.HeroPhotoUrl = patchData.HeroPhotoUrl;
        if (!string.IsNullOrWhiteSpace(patchData.Tagline))
            artist.Tagline = patchData.Tagline;
        if (!string.IsNullOrWhiteSpace(patchData.Description))
            artist.Description = patchData.Description;
        if (!string.IsNullOrWhiteSpace(patchData.Summary))
            artist.Summary = patchData.Summary;

        if (patchData.Bands != null)
            artist.Bands = patchData.Bands;

        if (patchData.OtherPhotos != null)
            artist.OtherPhotos = patchData.OtherPhotos;

        // Amps
        if (patchData.Amplifiers != null)
        {
            artist.Amplifiers.Clear();
            if (patchData.Amplifiers.Any())
            {
                var ampIds = patchData.Amplifiers.Select(a => a.Id).ToList();
                var amps = await _db.Amplifiers.Where(a => ampIds.Contains(a.Id)).ToListAsync();
                artist.Amplifiers = amps;
            }
        }

        // Guitars
        if (patchData.Guitars != null)
        {
            artist.Guitars.Clear();
            if (patchData.Guitars.Any())
            {
                var guitarIds = patchData.Guitars.Select(g => g.Id).ToList();
                var guitars = await _db.Guitars.Where(g => guitarIds.Contains(g.Id)).ToListAsync();
                artist.Guitars = guitars;
            }
        }

        await _db.SaveChangesAsync();

        var updated = await _db.Artists
            .Include(a => a.Amplifiers)
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == id);

        return Ok(updated!.ToDto());
    }
    
// -------------------------
// Add an amplifier to an artist (symmetric)
// -------------------------
[HttpPost("{artistId}/amps/{ampId}")]
public async Task<IActionResult> AddAmplifier(int artistId, int ampId)
{
    var artist = await _db.Artists
        .Include(a => a.Amplifiers)
        .FirstOrDefaultAsync(a => a.Id == artistId);

    var amp = await _db.Amplifiers
        .Include(a => a.Artists)
        .FirstOrDefaultAsync(a => a.Id == ampId);

    if (artist is null) return NotFound($"Artist {artistId} not found");
    if (amp is null) return NotFound($"Amp {ampId} not found");

    var updated = false;

    // Add amp to artist
    if (!artist.Amplifiers.Any(a => a.Id == ampId))
    {
        artist.Amplifiers.Add(amp);
        updated = true;
    }

    // Add artist to amp
    if (!amp.Artists.Any(a => a.Id == artistId))
    {
        amp.Artists.Add(artist);
        updated = true;
    }

    if (!updated)
        return Conflict("Artist is already linked to this amplifier.");

    await _db.SaveChangesAsync();
    return Ok(artist.ToDto());
}



    // -------------------------
    // Add a guitar to an artist (symmetric)
    // -------------------------
    [HttpPost("{artistId}/guitars/{guitarId}")]
    public async Task<IActionResult> AddGuitar(int artistId, int guitarId)
    {
        var artist = await _db.Artists
            .Include(a => a.Guitars)
            .FirstOrDefaultAsync(a => a.Id == artistId);

        var guitar = await _db.Guitars
            .Include(g => g.Artists)
            .FirstOrDefaultAsync(g => g.Id == guitarId);

        if (artist is null) return NotFound($"Artist {artistId} not found");
        if (guitar is null) return NotFound($"Guitar {guitarId} not found");

        var updated = false;

        // Add guitar to artist
        if (!artist.Guitars.Any(g => g.Id == guitarId))
        {
            artist.Guitars.Add(guitar);
            updated = true;
        }

        // Add artist to guitar
        if (!guitar.Artists.Any(a => a.Id == artistId))
        {
            guitar.Artists.Add(artist);
            updated = true;
        }

        if (!updated)
            return Conflict("Artist is already linked to this guitar.");

        await _db.SaveChangesAsync();
        return Ok(artist.ToDto());
    }

// -------------------------
// Remove an amplifier from an artist (symmetric)
// -------------------------
[HttpDelete("{artistId}/amps/{ampId}")]
public async Task<IActionResult> RemoveAmplifier(int artistId, int ampId)
{
    var artist = await _db.Artists
        .Include(a => a.Amplifiers)
        .FirstOrDefaultAsync(a => a.Id == artistId);

    var amp = await _db.Amplifiers
        .Include(a => a.Artists)
        .FirstOrDefaultAsync(a => a.Id == ampId);

    if (artist is null) return NotFound($"Artist {artistId} not found");
    if (amp is null) return NotFound($"Amp {ampId} not found");

    var updated = false;

    // Remove amp from artist
    if (artist.Amplifiers.Any(a => a.Id == ampId))
    {
        artist.Amplifiers.Remove(amp);
        updated = true;
    }

    // Remove artist from amp
    if (amp.Artists.Any(a => a.Id == artistId))
    {
        amp.Artists.Remove(artist);
        updated = true;
    }

    if (!updated)
        return NotFound("Relation not found.");

    await _db.SaveChangesAsync();
    return Ok(artist.ToDto());
}



// -------------------------
// Remove a guitar from an artist (symmetric)
// -------------------------
[HttpDelete("{artistId}/guitars/{guitarId}")]
public async Task<IActionResult> RemoveGuitar(int artistId, int guitarId)
{
    var artist = await _db.Artists
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == artistId);

    var guitar = await _db.Guitars
        .Include(g => g.Artists)
        .FirstOrDefaultAsync(g => g.Id == guitarId);

    if (artist is null) return NotFound($"Artist {artistId} not found");
    if (guitar is null) return NotFound($"Guitar {guitarId} not found");

    var updated = false;

    // Remove guitar from artist
    if (artist.Guitars.Any(g => g.Id == guitarId))
    {
        artist.Guitars.Remove(guitar);
        updated = true;
    }

    // Remove artist from guitar
    if (guitar.Artists.Any(a => a.Id == artistId))
    {
        guitar.Artists.Remove(artist);
        updated = true;
    }

    if (!updated)
        return NotFound("Relation not found.");

    await _db.SaveChangesAsync();
    return Ok(artist.ToDto());
}



    [HttpPost("{artistId}/bands")]
public async Task<IActionResult> AddBandsToArtist(int artistId, [FromBody] List<string> newBands)
{
    var artist = await _db.Artists
        .Include(a => a.Amplifiers)
        .Include(a => a.Guitars)
        .FirstOrDefaultAsync(a => a.Id == artistId);

    if (artist is null) 
        return NotFound($"Artist {artistId} not found");

    if (newBands == null || !newBands.Any())
        return BadRequest("No bands provided.");

    // Initialize if null
    artist.Bands ??= new List<string>();

    // Add only unique bands
    foreach (var band in newBands)
    {
        if (!artist.Bands.Contains(band))
        {
            artist.Bands.Add(band);
        }
    }

    // Force EF to see the change
    _db.Entry(artist).State = EntityState.Modified;

    await _db.SaveChangesAsync();

    return Ok(artist.ToDto());
}



    // -------------------------
    // DELETE
    // -------------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var artist = await _db.Artists.FindAsync(id);
        if (artist is null) return NotFound();

        _db.Artists.Remove(artist);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
