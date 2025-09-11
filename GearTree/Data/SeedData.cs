using Microsoft.EntityFrameworkCore;
using GearTree.Models; // so it knows about Amplifier, Artist, Guitar

namespace GearTree.Data
{
    public static class SeedData
    {
        public static void Initialize(GearContext context)
        {
            // Make sure DB is created
            context.Database.EnsureCreated();

            // If we already have any artists, then assume DB has been seeded
            if (context.Artists.Any())
            {
                return; 
            }

            // Seed Artists
            var artists = new List<Artist>
            {
                new Artist { Name = "Slash", PhotoUrl = "https://example.com/slash.jpg", Description = "Lead guitarist of Guns N' Roses", Bands = new List<string>{ "Guns N' Roses", "Velvet Revolver" } },
                new Artist { Name = "James Hetfield", PhotoUrl = "https://example.com/hetfield.jpg", Description = "Metallica frontman", Bands = new List<string>{ "Metallica" } }
            };

            // Seed Amplifiers
            var amps = new List<Amplifier>
            {
                new Amplifier { Name = "Marshall JCM800", PhotoUrl = "https://example.com/jcm800.jpg", Description = "Classic rock amp", IsTube = true, GainStructure = "High", YearStart = 1981, YearEnd = 1990 },
                new Amplifier { Name = "Mesa Dual Rectifier", PhotoUrl = "https://example.com/dualrec.jpg", Description = "Modern high-gain", IsTube = true, GainStructure = "High", YearStart = 1992, YearEnd = 2025 }
            };

            // Seed Guitars
            var guitars = new List<Guitar>
            {
                new Guitar { Name = "Gibson Les Paul", PhotoUrl = "https://example.com/lespaul.jpg", Description = "Iconic electric guitar", Type = "Electric", Genres = new List<string>{ "Rock", "Blues" }, Pickups = new List<string>{ "HH" }, YearStart = 1952 },
                new Guitar { Name = "Fender Stratocaster", PhotoUrl = "https://example.com/strat.jpg", Description = "Versatile classic", Type = "Electric", Genres = new List<string>{ "Rock", "Pop" }, Pickups = new List<string>{ "SSS" }, YearStart = 1954 }
            };

            // Add everything into the context
            context.Artists.AddRange(artists);
            context.Amplifiers.AddRange(amps);
            context.Guitars.AddRange(guitars);

            // Save changes to DB
            context.SaveChanges();
        }
    }
}
