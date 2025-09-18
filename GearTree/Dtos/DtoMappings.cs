using System.Linq;
using GearTree.Models;

namespace GearTree.Dtos
{
    public static class DtoMappings
    {
        public static ArtistDto ToDto(this Artist a)
        {
            return new ArtistDto
            {
                Id = a.Id,
                Name = a.Name,
                PhotoUrl = a.PhotoUrl,
                HeroPhotoUrl = a.HeroPhotoUrl,
                OtherPhotos = a.OtherPhotos ?? new List<string>(),
                Tagline = a.Tagline,
                Description = a.Description,
                Summary = a.Summary,
                Bands = a.Bands ?? new List<string>(),
                Amplifiers = (a.Amplifiers ?? Enumerable.Empty<Amplifier>()).Select(am => am.ToDto()).ToList(),
                Guitars = (a.Guitars ?? Enumerable.Empty<Guitar>()).Select(g => g.ToDto()).ToList()
            };
        }

        public static AmplifierDto ToDto(this Amplifier amp)
{
    return new AmplifierDto
    {
        Id = amp.Id,
        Name = amp.Name,
        PhotoUrl = amp.PhotoUrl,
        Description = amp.Description,
        Summary = amp.Summary,
        IsTube = amp.IsTube,
        GainStructure = amp.GainStructure,
        YearStart = amp.YearStart,
        YearEnd = amp.YearEnd,
        PriceStart = amp.PriceStart,
        PriceEnd = amp.PriceEnd,
        Wattage = amp.Wattage,
        SpeakerConfiguration = amp.SpeakerConfiguration,
        Manufacturer = amp.Manufacturer,
        OtherPhotos = amp.OtherPhotos ?? new List<string>(),

        Artists = (amp.Artists ?? Enumerable.Empty<Artist>())
            .Select(ar => new ArtistBriefDto
            {
                Id = ar.Id,
                Name = ar.Name,
                PhotoUrl = ar.PhotoUrl,
                Summary = ar.Summary
            })
            .ToList(),

        RelatedAmps = (amp.RelatedAmplifiers ?? Enumerable.Empty<Amplifier>())
            .Select(ra => new AmplifierBriefDto
            {
                Id = ra.Id,
                Name = ra.Name,
                PhotoUrl = ra.PhotoUrl,
                Summary = ra.Summary,
                YearStart = ra.YearStart,
                YearEnd = ra.YearEnd
            })
            .ToList()
    };
}
        

        public static GuitarDto ToDto(this Guitar g)
        {
            return new GuitarDto
            {
                Id = g.Id,
                Name = g.Name,
                PhotoUrl = g.PhotoUrl,
                Description = g.Description,
                Summary = g.Summary,
                Type = g.Type,
                Genres = g.Genres ?? new List<string>(),
                Pickups = g.Pickups ?? new List<string>(),
                YearStart = g.YearStart,
                YearEnd = g.YearEnd,
                Artists = (g.Artists ?? Enumerable.Empty<Artist>())
                    .Select(ar => new ArtistBriefDto { Id = ar.Id, Name = ar.Name, PhotoUrl = ar.PhotoUrl, Summary = ar.Summary })
                    .ToList(),
                RelatedGuitars = (g.RelatedGuitars ?? Enumerable.Empty<Guitar>())
                    .Select(r => new GuitarBriefDto
                    {
                        Id = r.Id,
                        Name = r.Name,
                        PhotoUrl = r.PhotoUrl,
                        Summary = r.Summary,
                        Type = r.Type,
                        YearStart = r.YearStart,
                        YearEnd = r.YearEnd
                    })
                    .ToList(),
            };
        }
    }
}
