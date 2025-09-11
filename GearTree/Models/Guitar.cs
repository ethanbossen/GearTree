namespace GearTree.Models;

public class Guitar
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string PhotoUrl { get; set; } = "";
    public string Description { get; set; } = "";
    public string Summary { get; set; } = "";
    public string Type { get; set; } = ""; // "Electric" or "Acoustic"
    public List<string> Genres { get; set; } = new();
    public List<string> Pickups { get; set; } = new(); // Like HSS, SSS, HH, etc.
    public int YearStart { get; set; }
    public int? YearEnd { get; set; }

    // Relationship
    public ICollection<Artist> Artists { get; set; } = new List<Artist>();
}
