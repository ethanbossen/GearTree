  namespace GearTree.Dtos
{
  
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
        public int YearStart { get; set; }
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