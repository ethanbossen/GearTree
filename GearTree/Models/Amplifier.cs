namespace GearTree.Models;

public class Amplifier
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string PhotoUrl { get; set; } = "";
    public string Description { get; set; } = "";
    public string Summary { get; set; } = "";
    public bool IsTube { get; set; }
    public string GainStructure { get; set; } = "";
    public int YearStart { get; set; }
    public int? YearEnd { get; set; }
    public int PriceStart { get; set; }
    public int PriceEnd { get; set; }
    public int Wattage { get; set; }
    public string SpeakerConfiguration { get; set; } = "";
    public string Manufacturer { get; set; } = "";
    public List<string> OtherPhotos { get; set; } = new();


    // Relationship
    public ICollection<Artist> Artists { get; set; } = new List<Artist>();
    public ICollection<Amplifier> RelatedAmplifiers { get; set; } = new List<Amplifier>();

}