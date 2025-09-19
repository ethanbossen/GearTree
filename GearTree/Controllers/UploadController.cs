// Controllers/UploadController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("[controller]")]
public class UploadController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string entityType, [FromForm] string fieldKey, [FromForm] string? artistName)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp"};
        var extension = Path.GetExtension(file.FileName)?.ToLowerInvariant();

         if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension))
            return BadRequest("Only image files are allowed (jpg, jpeg, png, gif, bmp, webp).");

        string folder = entityType.ToLower() switch
        {
            "amps" => Path.Combine("wwwroot", "images", "amps"),
            "guitars" => Path.Combine("wwwroot", "images", "guitars"),
            "artists" when fieldKey == "photoName" => Path.Combine("wwwroot", "images", "artists"),
            "artists" when fieldKey == "heroPhotoName" => Path.Combine("wwwroot", "images", "artists", "artistCont", Slugify(artistName)),
            _ => throw new ArgumentException("Invalid entityType or fieldKey")
        };

        Directory.CreateDirectory(folder);

        string filePath = Path.Combine(folder, file.FileName);
        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        string publicUrl = entityType.ToLower() switch
        {
            "amps" => $"/images/amps/{file.FileName}",
            "guitars" => $"/images/guitars/{file.FileName}",
            "artists" when fieldKey == "photoName" => $"/images/artists/{file.FileName}",
            "artists" when fieldKey == "heroPhotoName" => $"/images/artists/artistCont/{Slugify(artistName)}/{file.FileName}",
            _ => ""
        };

        return Ok(new { url = publicUrl });
    }

    private string Slugify(string? input)
    {
        if (string.IsNullOrWhiteSpace(input)) return "unknown";
        return input.Trim().ToLower().Replace(" ", "-");
    }
}