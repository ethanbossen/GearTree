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
    public async Task<IActionResult> Create(UpdateArtistDto dto)
    {
        if (await _db.Artists.AnyAsync(a => a.Name == dto.Name))
            return Conflict($"An artist with the name '{dto.Name}' already exists.");

        var artist = new Artist
        {
            Name = dto.Name!,
            PhotoUrl = dto.PhotoUrl ?? "",
            HeroPhotoUrl = dto.HeroPhotoUrl ?? "",
            Tagline = dto.Tagline ?? "",
            Description = dto.Description ?? "",
            Summary = dto.Summary ?? "",
            Bands = dto.Bands ?? new List<string>(),
            OtherPhotos = dto.OtherPhotos ?? new List<string>()
        };

        // Resolve amps
        if (dto.AmplifierIds != null && dto.AmplifierIds.Any())
        {
            artist.Amplifiers = await _db.Amplifiers
                .Where(a => dto.AmplifierIds.Contains(a.Id))
                .ToListAsync();
        }

        // Resolve guitars
        if (dto.GuitarIds != null && dto.GuitarIds.Any())
        {
            artist.Guitars = await _db.Guitars
                .Where(g => dto.GuitarIds.Contains(g.Id))
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
    public async Task<IActionResult> Update(int id, [FromBody] UpdateArtistDto dto)
    {
        var artist = await _db.Artists.FirstOrDefaultAsync(a => a.Id == id);
        if (artist is null) return NotFound();

        // Scalars
        if (!string.IsNullOrWhiteSpace(dto.Name)) artist.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.PhotoUrl)) artist.PhotoUrl = dto.PhotoUrl;
        if (!string.IsNullOrWhiteSpace(dto.HeroPhotoUrl)) artist.HeroPhotoUrl = dto.HeroPhotoUrl;
        if (!string.IsNullOrWhiteSpace(dto.Tagline)) artist.Tagline = dto.Tagline;
        if (!string.IsNullOrWhiteSpace(dto.Description)) artist.Description = dto.Description;
        if (!string.IsNullOrWhiteSpace(dto.Summary)) artist.Summary = dto.Summary;

        // Merge Bands instead of overwriting
        if(updateDto.Bands != null && updateDto.Genres.Any()) {
            if artist.Bands == null || !artist.Bands.Any() {
                artist.Bands = updateDto.Bands.ToList();
            } else {
                artist.Bands.AddRange(updateDto.Bands.Where(a => !artist.Bands.Contains(a)));
            }
        }
    

        // Merge OtherPhotos instead of overwriting
        if (dto.OtherPhotos != null && dto.OtherPhotos.Any())
        {
            artist.OtherPhotos ??= new List<string>();
            artist.OtherPhotos.AddRange(dto.OtherPhotos.Where(p => !artist.OtherPhotos.Contains(p)));
        }

        await _db.SaveChangesAsync();

        // Reload artist with relationships for return
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
    public async Task<IActionResult> Patch(int id, [FromBody] UpdateArtistDto dto)
    {
        var artist = await _db.Artists.FirstOrDefaultAsync(a => a.Id == id);
        if (artist is null) return NotFound();

        // Scalars
        if (!string.IsNullOrWhiteSpace(dto.Name)) artist.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.PhotoUrl)) artist.PhotoUrl = dto.PhotoUrl;
        if (!string.IsNullOrWhiteSpace(dto.HeroPhotoUrl)) artist.HeroPhotoUrl = dto.HeroPhotoUrl;
        if (!string.IsNullOrWhiteSpace(dto.Tagline)) artist.Tagline = dto.Tagline;
        if (!string.IsNullOrWhiteSpace(dto.Description)) artist.Description = dto.Description;
        if (!string.IsNullOrWhiteSpace(dto.Summary)) artist.Summary = dto.Summary;

        // Merge OtherPhotos instead of overwriting
        if (dto.OtherPhotos != null && dto.OtherPhotos.Any())
        {
            artist.OtherPhotos ??= new List<string>();
            artist.OtherPhotos.AddRange(dto.OtherPhotos.Where(p => !artist.OtherPhotos.Contains(p)));
        }
        // Merge Bands instead of overwriting
        if (dto.Bands != null && dto.Bands.Any())
        {
            artist.Bands ??= new List<string>();
            artist.Bands.AddRange(dto.Bands.Where(p => !artist.Bands.Contains(p)));
        }

        await _db.SaveChangesAsync();

        // Reload artist with relationships for return
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
