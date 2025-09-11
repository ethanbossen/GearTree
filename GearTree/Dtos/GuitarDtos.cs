namespace GearTree.Dtos
{
    public class GuitarDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Description { get; set; }
        public string? Type { get; set; }
        public List<string>? Genres { get; set; }
        public List<string>? Pickups { get; set; }
        public int YearStart { get; set; }
        public int? YearEnd { get; set; }

        public List<ArtistBriefDto> Artists { get; set; } = new();
    }
}
