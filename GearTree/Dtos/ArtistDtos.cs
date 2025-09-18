using System.ComponentModel.DataAnnotations;

namespace GearTree.Dtos
{
      public class UpdateArtistDto
{
    [StringLength(100, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 100 characters")]
    public string? Name { get; set; }

    [Url(ErrorMessage = "PhotoUrl must be a valid URL")]
    public string? PhotoUrl { get; set; }

    [Url(ErrorMessage = "HeroPhotoUrl must be a valid URL")]
    public string? HeroPhotoUrl { get; set; }

    public List<string> OtherPhotos { get; set; } = new();

    [StringLength(200, ErrorMessage = "Tagline cannot exceed 200 characters")]
    public string? Tagline { get; set; }

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    public string? Description { get; set; }

    [StringLength(500, ErrorMessage = "Summary cannot exceed 500 characters")]
    public string? Summary { get; set; }

    public List<string> Bands { get; set; } = new();

    // Relations as IDs only
    public List<int>? AmplifierIds { get; set; }
    public List<int>? GuitarIds { get; set; }
}

    public class ArtistDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? HeroPhotoUrl { get; set; }
        public List<string>? OtherPhotos { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }
        public string? Summary { get; set; }
        public List<string>? Bands { get; set; }

        public List<AmplifierDto> Amplifiers { get; set; } = new();
        public List<GuitarDto> Guitars { get; set; } = new();
    }
    public class ArtistBriefDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Summary { get; set; }
    }

}