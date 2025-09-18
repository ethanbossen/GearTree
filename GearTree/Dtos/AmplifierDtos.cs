using System.ComponentModel.DataAnnotations;
  
  namespace GearTree.Dtos
{
public class UpdateAmplifierDto
{
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
    public string? Name { get; set; }

    [Url(ErrorMessage = "PhotoUrl must be a valid URL")]
    public string? PhotoUrl { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
    public string? Description { get; set; }

    [StringLength(200, ErrorMessage = "Summary cannot exceed 200 characters")]
    public string? Summary { get; set; }

    public bool? IsTube { get; set; }

    [StringLength(100, ErrorMessage = "Gain structure description is too long")]
    public string? GainStructure { get; set; }

    [Range(1900, 2100, ErrorMessage = "YearStart must be between 1900 and 2100")]
    public int? YearStart { get; set; }

    [Range(1900, 2100, ErrorMessage = "YearEnd must be between 1900 and 2100")]
    public int? YearEnd { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "PriceStart must be a positive number")]
    public int? PriceStart { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "PriceEnd must be a positive number")]
    public int? PriceEnd { get; set; }

    [Range(0, int.MaxValue, ErrorMessage = "Wattage must be a positive number")]
    public int? Wattage { get; set; }

    [StringLength(100, ErrorMessage = "Speaker configuration is too long")]
    public string? SpeakerConfiguration { get; set; }

    [StringLength(100, ErrorMessage = "Manufacturer name is too long")]
    public string? Manufacturer { get; set; }

    public List<string> OtherPhotos { get; set; } = new();

    // Relations as IDs only
    public List<int>? RelatedIds { get; set; }
    public List<int>? ArtistIds { get; set; }
}
    
   public class AmplifierBriefDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Summary { get; set; }
        public int YearStart { get; set; }
        public int? YearEnd { get; set; }
    }

    public class AmplifierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Description { get; set; }
        public string? Summary { get; set; }
        public bool IsTube { get; set; }
        public string? GainStructure { get; set; }
        public int? YearStart { get; set; }
        public int? YearEnd { get; set; }
        public int PriceStart { get; set; }
        public int PriceEnd { get; set; }
        public int Wattage { get; set; }
        public string? SpeakerConfiguration { get; set; }
        public string? Manufacturer { get; set; }
        public List<string>? OtherPhotos { get; set; }

        public List<AmplifierBriefDto> RelatedAmps { get; set; } = new();

        public List<ArtistBriefDto> Artists { get; set; } = new();
    }
}