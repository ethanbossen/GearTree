namespace GearTree.Dtos
{
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

    public class AmplifierBriefDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
    }

    public class GuitarBriefDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
    }
}
