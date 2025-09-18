namespace GearTree.Dtos
{
public class UpdateGuitarDto
{
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
    public string? Name { get; set; }

    [Url(ErrorMessage = "PhotoUrl must be a valid URL")]
    public string? PhotoUrl { get; set; }

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }

    [StringLength(500, ErrorMessage = "Summary cannot exceed 500 characters")]
    public string? Summary { get; set; }

    [StringLength(50, ErrorMessage = "Type cannot exceed 50 characters")]
    public string? Type { get; set; }

    public List<string> Genres { get; set; } = new();
    public List<string> Pickups { get; set; } =new();

    [Range(1900, 2100, ErrorMessage = "YearStart must be between 1900 and 2100")]
    public int? YearStart { get; set; }  

    [Range(1900, 2100, ErrorMessage = "YearEnd must be between 1900 and 2100")]
    public int? YearEnd { get; set; }

    // Relations as IDs only
    public List<int>? ArtistIds { get; set; }
    public List<int>? RelatedIds { get; set; }
}
    public class GuitarDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Description { get; set; }
        public string? Summary { get; set; }
        public string? Type { get; set; }
        public List<string>? Genres { get; set; }
        public List<string>? Pickups { get; set; }
        public int YearStart { get; set; }
        public int? YearEnd { get; set; }

        public List<ArtistBriefDto> Artists { get; set; } = new();
        public List<GuitarBriefDto> RelatedGuitars { get; set; } = new();
    }

    public class GuitarBriefDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Summary { get; set; }
        public string? Type { get; set; }
        public int YearStart { get; set; }
        public int? YearEnd { get; set; }
    }
}
