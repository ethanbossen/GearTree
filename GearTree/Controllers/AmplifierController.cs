using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GearTree.Data;
using GearTree.Models;
using GearTree.Dtos;

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
            .FirstOrDefaultAsync(a => a.Id == id);

        if (amp == null) return NotFound();
        return Ok(amp.ToDto());
    }

    // -------------------------
    // CREATE (POST)
    // -------------------------
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Amplifier amp)
    {
        if (await _db.Amplifiers.AnyAsync(a => a.Name == amp.Name))
        {
            return Conflict($"An amplifier with the name '{amp.Name}' already exists.");
        }

        _db.Amplifiers.Add(amp);
        await _db.SaveChangesAsync();

        var created = await _db.Amplifiers
            .Include(a => a.Artists)
            .FirstOrDefaultAsync(a => a.Id == amp.Id);

        return CreatedAtAction(nameof(GetById), new { id = amp.Id }, created!.ToDto());
    }

    // -------------------------
    // UPDATE (PUT)
    // -------------------------
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Amplifier updatedAmp)
    {
        var amp = await _db.Amplifiers.FindAsync(id);
        if (amp == null) return NotFound();

        amp.Name = updatedAmp.Name;
        amp.PhotoUrl = updatedAmp.PhotoUrl;
        amp.Description = updatedAmp.Description;
        amp.IsTube = updatedAmp.IsTube;
        amp.GainStructure = updatedAmp.GainStructure;
        amp.YearStart = updatedAmp.YearStart;
        amp.YearEnd = updatedAmp.YearEnd;

        await _db.SaveChangesAsync();
        return NoContent();
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
    // PARTIAL UPDATE (PATCH)
    // -------------------------
    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(int id, [FromBody] Amplifier updatedAmp)
    {
        var amp = await _db.Amplifiers.FindAsync(id);
        if (amp == null) return NotFound();

        if (!string.IsNullOrEmpty(updatedAmp.Name))
            amp.Name = updatedAmp.Name;
        if (!string.IsNullOrEmpty(updatedAmp.PhotoUrl))
            amp.PhotoUrl = updatedAmp.PhotoUrl;
        if (!string.IsNullOrEmpty(updatedAmp.Description))
            amp.Description = updatedAmp.Description;
        if (!string.IsNullOrEmpty(updatedAmp.Summary))
            amp.Summary = updatedAmp.Summary;
        if (!string.IsNullOrEmpty(updatedAmp.GainStructure))
            amp.GainStructure = updatedAmp.GainStructure;
        if (updatedAmp.YearStart != 0)
            amp.YearStart = updatedAmp.YearStart;
        if (updatedAmp.YearEnd != 0)
            amp.YearEnd = updatedAmp.YearEnd;

        amp.IsTube = updatedAmp.IsTube;

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
