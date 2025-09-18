using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GearTree.Data;
using GearTree.Models;
using GearTree.Dtos;
using GearTree.Helpers;

[ApiController]
[Route("amps")]
public class AmplifiersController : ControllerBase
{
    private readonly GearContext _db;

    public AmplifiersController(GearContext db)
    {
        _db = db;
    }

    // -------------------------
    // GET all amps
    // -------------------------
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var amps = await _db.Amplifiers
            .Include(a => a.Artists)
            .Include(a => a.RelatedAmplifiers)
            .ToListAsync();

        return Ok(amps.Select(a => a.ToDto()).ToList());
    }

    // -------------------------
    // GET by id
    // -------------------------
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var amp = await _db.Amplifiers
            .Include(a => a.Artists)
            .Include(a => a.RelatedAmplifiers)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (amp == null) return NotFound();
        return Ok(amp.ToDto());
    }

    // -------------------------
    // CREATE (POST)
    // -------------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UpdateAmplifierDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Amplifier name is required.");

        if (await _db.Amplifiers.AnyAsync(a => a.Name == dto.Name))
            return Conflict($"An amplifier with the name '{dto.Name}' already exists.");

        var amp = new Amplifier
        {
            Name = dto.Name!,
            PhotoUrl = dto.PhotoUrl ?? "",
            Description = dto.Description ?? "",
            Summary = dto.Summary ?? "",
            GainStructure = dto.GainStructure ?? "",
            IsTube = dto.IsTube ?? false,
            YearStart = dto.YearStart ?? 0,
            YearEnd = dto.YearEnd ?? 0,
            priceStart = dto.PriceStart ?? 0,
            priceEnd = dto.PriceEnd ?? 0,
            Wattage = dto.Wattage ?? 0,
            SpeakerConfiguration = dto.SpeakerConfiguration ?? "",
            Manufacturer = dto.Manufacturer ?? "",
            OtherPhotos = dto.OtherPhotos ?? new List<string>()
        };

        // Resolve artists
        if (dto.ArtistIds != null && dto.ArtistIds.Any())
        {
            amp.Artists = await _db.Artists
                .Where(a => dto.ArtistIds.Contains(a.Id))
                .ToListAsync();
        }

        // Resolve related amps
        if (dto.RelatedIds != null && dto.RelatedIds.Any())
        {
            amp.RelatedAmplifiers = await _db.Amplifiers
                .Where(a => dto.RelatedIds.Contains(a.Id))
                .ToListAsync();
        }

        _db.Amplifiers.Add(amp);
        await _db.SaveChangesAsync();

        var created = await _db.Amplifiers
            .Include(a => a.Artists)
            .Include(a => a.RelatedAmplifiers)
            .FirstOrDefaultAsync(a => a.Id == amp.Id);

        return CreatedAtAction(nameof(GetById), new { id = amp.Id }, created!.ToDto());
    }

    // -------------------------
    // UPDATE (PUT)
    // -------------------------
    [HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] AmplifierDto dto)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var amp = await _db.Amplifiers.FindAsync(id);
    if (amp == null) return NotFound();

    // Overwrite all fields
    amp.Name = dto.Name;
    amp.PhotoUrl = dto.PhotoUrl;
    amp.Description = dto.Description;
    amp.Summary = dto.Summary;
    amp.GainStructure = dto.GainStructure;
    amp.IsTube = dto.IsTube;
    amp.YearStart = dto.YearStart;
    amp.YearEnd = dto.YearEnd;
    amp.PriceStart = dto.PriceStart;
    amp.PriceEnd = dto.PriceEnd;
    amp.Wattage = dto.Wattage;
    amp.SpeakerConfiguration = dto.SpeakerConfiguration;
    amp.Manufacturer = dto.Manufacturer;
    amp.OtherPhotos = dto.OtherPhotos ?? new List<string>();

    await _db.SaveChangesAsync();
    return Ok(amp.ToDto());
}


    // -------------------------
    // PARTIAL UPDATE (PATCH)
    // -------------------------
    [HttpPatch("{id}")]
public async Task<IActionResult> Patch(int id, [FromBody] UpdateAmplifierDto dto)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);

    var amp = await _db.Amplifiers.FindAsync(id);
    if (amp == null) return NotFound();

    amp.ApplyPatch(dto);

    if (dto.OtherPhotos.Any())
    {
        amp.OtherPhotos.AddRange(dto.OtherPhotos.Where(p => !amp.OtherPhotos.Contains(p)));
    }

    await _db.SaveChangesAsync();
    return Ok(amp.ToDto());
}
    // -------------------------
    // Add an artist to an amplifier
    // -------------------------
    [HttpPost("{ampId}/artists/{artistId}")]
    public async Task<IActionResult> AddArtistToAmp(int ampId, int artistId)
    {
        var amp = await _db.Amplifiers
            .Include(a => a.Artists)
            .FirstOrDefaultAsync(a => a.Id == ampId);

        if (amp is null) return NotFound($"Amp {ampId} not found");

        var artist = await _db.Artists.FindAsync(artistId);
        if (artist is null) return NotFound($"Artist {artistId} not found");

        if (!amp.Artists.Any(a => a.Id == artistId))
            amp.Artists.Add(artist);

        await _db.SaveChangesAsync();

        return Ok(amp.ToDto());
    }

    // -------------------------
    // Add a related amp (symmetric)
    // -------------------------
    [HttpPost("{ampId}/related/{relatedId}")]

    public async Task<IActionResult> AddRelatedAmp(int ampId, int relatedId)
    {
        if (ampId == relatedId)
            return BadRequest("An amp cannot be related to itself.");

        var amp = await _db.Amplifiers
            .Include(a => a.RelatedAmplifiers)
            .FirstOrDefaultAsync(a => a.Id == ampId);

        var related = await _db.Amplifiers
            .Include(a => a.RelatedAmplifiers)
            .FirstOrDefaultAsync(a => a.Id == relatedId);

        if (amp == null || related == null)
            return NotFound("Amp or related amp not found.");

        // Add both directions if missing
        if (!amp.RelatedAmplifiers.Any(a => a.Id == relatedId))
            amp.RelatedAmplifiers.Add(related);

        if (!related.RelatedAmplifiers.Any(a => a.Id == ampId))
            related.RelatedAmplifiers.Add(amp);

        await _db.SaveChangesAsync();
        return Ok(amp.ToDto());
    }

   
    // -------------------------
    // DELETE
    // -------------------------
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var amp = await _db.Amplifiers.FindAsync(id);
        if (amp == null) return NotFound();

        _db.Amplifiers.Remove(amp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
