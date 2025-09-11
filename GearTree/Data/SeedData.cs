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
    new Artist
    {
        Name = "Zakk Wylde",
        PhotoUrl = "https://picsum.photos/seed/zakkwylde/300/300",
        Summary = "High-gain Les Paul virtuoso known for thick rhythm and searing sustain.",
        Description = @"Zakk Wylde’s early tone with Ozzy Osbourne came from his Gibson Les Paul Customs—most famously the bullseye model—loaded with EMG 81/85 pickups, cranked through Marshall JCM800s and JCM900s. This combo gave him the tight, high-gain crunch and searing sustain that defined his late-’80s and ’90s sound.

With Black Label Society, he doubled down on heaviness, sticking with EMG-equipped Les Pauls but pushing his Marshalls even harder for a thicker, more aggressive grind. His crushing rhythm tone and screaming pinch harmonics became trademarks of the band’s massive, sludgy sound.

In recent years, Zakk has carried that formula into his own Wylde Audio guitars and amps. Built to capture the Les Paul-meets-Marshall recipe with his custom tweaks, they keep his tone consistent: huge, saturated, and instantly recognizable.",
        Bands = new List<string> { "Black Label Society", "Ozzy Osbourne" }
    },

    new Artist
    {
        Name = "Eddie Van Halen",
        PhotoUrl = "https://picsum.photos/seed/eddievanhalen/300/300",
        Summary = "Innovative rock guitarist famous for two-handed tapping and tone.",
        Description = @"Eddie Van Halen revolutionized electric guitar technique and tone in the late 1970s and 80s. He is best known for two-handed tapping, harmonics, and his high-gain, mid-forward sound built around modified amps and Frankenstrat guitars.

His playing inspired generations of rock and metal players and helped define the sound of modern rock guitar.",
        Bands = new List<string> { "Van Halen" }
    },

    new Artist
    {
        Name = "Stevie Ray Vaughan",
        PhotoUrl = "https://picsum.photos/seed/stevieray/300/300",
        Summary = "Texas blues guitar legend with fierce vibrato and tone.",
        Description = @"Stevie Ray Vaughan brought blues to a new mainstream audience in the 1980s with burning single-note runs, heavy strings, and soulful playing. His tone combined Fender Stratocaster clarity with hard, aggressive attack and wide vibrato.

A master of dynamics and phrasing, Stevie's influence on blues and rock guitar remains enormous.",
        Bands = new List<string> { "Double Trouble" }
    },

    new Artist
    {
        Name = "David Gilmour",
        PhotoUrl = "https://picsum.photos/seed/davidgilmour/300/300",
        Summary = "Melodic soloist and tone sculptor behind Pink Floyd's sound.",
        Description = @"David Gilmour is celebrated for long, singing guitar lines and an evocative, carefully shaped tone. His restrained phrasing, tasteful bends and use of effects created some of the most memorable guitar moments in progressive rock.

Gilmour's approach emphasizes melody and color over speed, making his solos emotionally resonant and instantly recognizable.",
        Bands = new List<string> { "Pink Floyd" }
    },

    new Artist
    {
        Name = "John Mayer",
        PhotoUrl = "https://picsum.photos/seed/johnmayer/300/300",
        Summary = "Modern blues-pop guitarist known for touch and tone.",
        Description = @"John Mayer blends blues phrasing with pop sensibility, emphasizing clean touch, dynamics, and warm, mid-forward tones. He often favors Stratocaster-style guitars and highly controlled vibrato to craft melodic lines.

Across his solo work and collaborations, Mayer balances technical ability with songwriting and tonecraft.",
        Bands = new List<string> { "John Mayer Trio" }
    }
};

            // Seed Amplifiers
           // --- Amplifiers (small batch) ---
var amps = new List<Amplifier>
{
    new Amplifier
    {
        Name = "Marshall JCM800",
        PhotoUrl = "https://picsum.photos/seed/jcm800/300/300",
        Summary = "Classic 1980s high-gain amp that helped define rock and metal.",
        Description = @"The Marshall JCM800 became a workhorse for hard rock and metal players in the 1980s. Its straightforward, aggressive mids and tight high-gain character made it ideal for driving guitar distortion and cutting through dense mixes.

Players typically pair the JCM800 with Les Pauls or other humbucker-equipped guitars to get that signature crunchy rhythm sound.",
        IsTube = true,
        GainStructure = "High",
        YearStart = 1981,
        YearEnd = 1991
    },

    new Amplifier
    {
        Name = "Mesa/Boogie Dual Rectifier",
        PhotoUrl = "https://picsum.photos/seed/dualrect/300/300",
        Summary = "Modern high-gain tube amp widely used for metal and heavy rock.",
        Description = @"Mesa's Dual Rectifier introduced a thick, saturated mid-focused high-gain voice that became a standard for modern heavy guitar tones. Its multiple channel voicings and heavy low-end response made it a favorite for drop-tuned and aggressive rhythm work.

The amp's forceful low-end and scooped mids can be tailored with the presence and contour controls for tighter or looser response.",
        IsTube = true,
        GainStructure = "High",
        YearStart = 1992,
        YearEnd = 2025
    },

    new Amplifier
    {
        Name = "Fender Twin Reverb",
        PhotoUrl = "https://picsum.photos/seed/twinreverb/300/300",
        Summary = "Amp first produced in 1963 and utilized by legends like Jimi Hendrix, The Rolling Stones and Pink Floyd.",
        Description = @"Fender Twin Reverb is famous for crystal-clear clean tones, lush spring reverb, and generous headroom. Often favored by jazz, country and clean-tone players, the Twin remains a benchmark for pristine clean sounds.

When pushed, it can produce a warm breakup, but the Twin is best known for its shimmering cleans and depth.",
        IsTube = true,
        GainStructure = "Clean",
        YearStart = 1963,
        YearEnd = 2025
    },

    new Amplifier
    {
        Name = "Vox AC30",
        PhotoUrl = "https://picsum.photos/seed/ac30/300/300",
        Summary = "Chimey British amp popularized by the British Invasion.",
        Description = @"The Vox AC30 is prized for its bright, jangly character and natural compression. It has a distinctive top-end chime that works brilliantly with single-coil guitars and cleans with sweet harmonic richness.

Many players dial in slight breakup to get the classic 'Beatles/Clapton' type tones associated with the amp.",
        IsTube = true,
        GainStructure = "Clean",
        YearStart = 1958,
        YearEnd = 2025
    },

    new Amplifier
    {
        Name = "Orange AD30",
        PhotoUrl = "https://picsum.photos/seed/orangead30/300/300",
        Summary = "Thick British-voiced amp with warm mids and rounded low end.",
        Description = @"Orange amps are known for their distinctive midrange and warm, musical overdrive. The AD30 delivers a woody, mid-forward voicing that suits classic rock and blues as well as modern alternative styles.

Its tonal character sits between the chime of Vox and the bite of Marshall, offering a pleasant balance for many players.",
        IsTube = true,
        GainStructure = "Crunch",
        YearStart = 1997,
        YearEnd = 2025
    }
};


          // --- Guitars (small batch) ---
var guitars = new List<Guitar>
{
    new Guitar
    {
        Name = "Gibson Les Paul Standard",
        PhotoUrl = "https://picsum.photos/seed/lespaul/300/300",
        Summary = "Humbucker-equipped rock staple known for sustain and thickness.",
        Description = @"The Gibson Les Paul Standard is celebrated for its thick, sustaining tone and powerful midrange. With humbucking pickups and a mahogany body, it's a favorite for high-gain rock, blues and classic tones.

Players prize the Les Paul for its note-to-note sustain and harmonically rich response.",
        Type = "Electric",
        Genres = new List<string> { "Rock", "Blues", "Metal" },
        Pickups = new List<string> { "HH" },
        YearStart = 1952,
        YearEnd = 0
    },

    new Guitar
    {
        Name = "Fender Stratocaster",
        PhotoUrl = "https://picsum.photos/seed/strat/300/300",
        Summary = "Versatile single-coil classic used across genres.",
        Description = @"The Fender Stratocaster is one of the most versatile electric guitars, known for its articulate single-coil voice and comfortable ergonomics. It covers everything from glassy cleans to snappy overdriven tones.

Its five-position switching and varied pickup combinations make it a go-to for many players.",
        Type = "Electric",
        Genres = new List<string> { "Rock", "Pop", "Blues", "Funk" },
        Pickups = new List<string> { "SSS" },
        YearStart = 1954,
        YearEnd = 0
    },

    new Guitar
    {
        Name = "PRS Custom 24",
        PhotoUrl = "https://picsum.photos/seed/prs24/300/300",
        Summary = "Modern hybrid with versatile tones and coil-split options.",
        Description = @"PRS Custom 24 blends the playability of modern guitars with tones suitable for rock, fusion, and studio work. Its humbucking pickups and high quality build allow balanced clarity and heavy saturation when needed.

The Custom 24 is prized for its reliability and tonal flexibility.",
        Type = "Electric",
        Genres = new List<string> { "Rock", "Fusion", "Blues" },
        Pickups = new List<string> { "HH" },
        YearStart = 1985,
        YearEnd = 0
    },

    new Guitar
    {
        Name = "Fender Telecaster",
        PhotoUrl = "https://picsum.photos/seed/tele/300/300",
        Summary = "Simple, twangy, and reliable for country, rock and beyond.",
        Description = @"The Telecaster is celebrated for its bright, cutting single-coil sound and simple, roadworthy design. It excels at percussive rhythm parts and has been used by players across country, rock and blues.

Its straightforward electronics make it easy to dial usable tones quickly on stage.",
        Type = "Electric",
        Genres = new List<string> { "Country", "Rock", "Blues" },
        Pickups = new List<string> { "SS" },
        YearStart = 1950,
        YearEnd = 0
    },

    new Guitar
    {
        Name = "Ibanez RG",
        PhotoUrl = "https://picsum.photos/seed/ibanezrg/300/300",
        Summary = "Shredders' choice — thin necks and hot pickups for speed.",
        Description = @"The Ibanez RG series is designed for high-speed rock and metal, featuring thin, fast necks and powerful pickups. Its ergonomic body and often a floating tremolo make it a popular choice for technical players.

RGs are built around playability and precision for modern lead work.",
        Type = "Electric",
        Genres = new List<string> { "Metal", "Rock" },
        Pickups = new List<string> { "HSH" },
        YearStart = 1987,
        YearEnd = 0
    }
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
