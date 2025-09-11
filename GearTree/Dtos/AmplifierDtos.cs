namespace GearTree.Dtos
{
    public class ArtistBriefDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
    }

    public class AmplifierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string? PhotoUrl { get; set; }
        public string? Description { get; set; }
        public bool IsTube { get; set; }
        public string? GainStructure { get; set; }
        public int YearStart { get; set; }
        public int YearEnd { get; set; }

        public List<ArtistBriefDto> Artists { get; set; } = new();
    }
}
