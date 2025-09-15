namespace GearTree.Dtos
{
      public class UpdateArtistDto
    {
        public string? Name { get; set; }
        public string? PhotoUrl { get; set; }
        public string? HeroPhotoUrl { get; set; }
        public List<string>? OtherPhotos { get; set; }
        public string? Tagline { get; set; }
        public string? Description { get; set; }
        public string? Summary { get; set; }
        public List<string>? Bands { get; set; }

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