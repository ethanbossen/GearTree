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
                Artists = (amp.Artists ?? Enumerable.Empty<Artist>())
                    .Select(ar => new ArtistBriefDto { Id = ar.Id, Name = ar.Name })
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
                    .Select(ar => new ArtistBriefDto { Id = ar.Id, Name = ar.Name })
                    .ToList()
            };
        }
    }
}
