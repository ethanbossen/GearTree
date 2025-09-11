namespace GearTree.Models;

public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string PhotoUrl { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> Bands { get; set; } = new();

    // Relationships
    public ICollection<Amplifier> Amplifiers { get; set; } = new List<Amplifier>();
    public ICollection<Guitar> Guitars { get; set; } = new List<Guitar>();
}

