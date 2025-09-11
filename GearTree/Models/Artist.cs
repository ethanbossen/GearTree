namespace GearTree.Models;

public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string PhotoUrl { get; set; } = "";
    public string HeroPhotoUrl { get; set; } = "";
    public List<string> OtherPhotos { get; set; } = new();
    public string Tagline { get; set; } = "";
    public string Description { get; set; } = "";
    public string Summary { get; set; } = "";
    public List<string> Bands { get; set; } = new();


    // Relationships
    public ICollection<Amplifier> Amplifiers { get; set; } = new List<Amplifier>();
    public ICollection<Guitar> Guitars { get; set; } = new List<Guitar>();
}

