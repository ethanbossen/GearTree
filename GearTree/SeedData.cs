using Microsoft.EntityFrameworkCore;
using GearTree.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public static class SeedData
{
    public static async Task Initialize(GearContext context)
    {
        // Clear existing data in correct order (handle relationships first)
        await ClearDatabase(context);

        // Add guitars
        var guitars = GetGuitars();
        context.Guitars.AddRange(guitars);
        await context.SaveChangesAsync();

        // Add amplifiers
        var amplifiers = GetAmplifiers();
        context.Amplifiers.AddRange(amplifiers);
        await context.SaveChangesAsync();

        // Add artists
        var artists = GetArtists();
        context.Artists.AddRange(artists);
        await context.SaveChangesAsync();

        // Establish relationships
        await EstablishRelationships(context);
    }

    private static async Task ClearDatabase(GearContext context)
    {
        // Clear junction tables first
        context.Database.ExecuteSqlRaw("DELETE FROM GuitarRelation");
        context.Database.ExecuteSqlRaw("DELETE FROM AmplifierRelation");

        // Clear main tables
        context.Guitars.RemoveRange(context.Guitars);
        context.Amplifiers.RemoveRange(context.Amplifiers);
        context.Artists.RemoveRange(context.Artists);

        await context.SaveChangesAsync();
    }

    private static List<Guitar> GetGuitars()
    {
        return new List<Guitar>
        {
            // Your existing guitars
            new Guitar {
                Name = "Gibson Les Paul Standard",
                PhotoUrl = "/images/guitars/lp-standard.jpg",
                Description = "The Gibson Les Paul Standard is celebrated for its thick, sustaining tone and powerful midrange. With humbucking pickups and a mahogany body, it's a favorite for high-gain rock, blues and classic tones.\r\n\r\nPlayers prize the Les Paul for its note-to-note sustain and harmonically rich response.",
                Summary = "Humbucker-equipped rock staple known for sustain and thickness.",
                Type = "Electric",
                Genres = new List<string> {"Blues", "Rock", "Metal", "Jazz"},
                Pickups = new List<string> {"HH"},
                YearStart = 1952,
                YearEnd = null
            },
            new Guitar {
                Name = "Fender Stratocaster",
                PhotoUrl = "/images/guitars/strat.jpg",
                Description = "The Fender Stratocaster is one of the most versatile electric guitars, known for its articulate single-coil voice and comfortable ergonomics. It covers everything from glassy cleans to snappy overdriven tones.\r\n\r\nIts five-position switching and varied pickup combinations make it a go-to for many players.",
                Summary = "Versatile single-coil classic used across genres.",
                Type = "Electric",
                Genres = new List<string>(),
                Pickups = new List<string> {"SSS"},
                YearStart = 1954,
                YearEnd = 0
            },
            new Guitar {
                Name = "Fender Telecaster",
                PhotoUrl = "/images/guitars/tele.jpg",
                Description = "The Fender Telecaster is known for its bright, cutting tone and simple yet effective design. With two single-coil pickups, it delivers twangy cleans and biting overdrive, making it a favorite in country, rock, and blues.\r\n\r\nIts straightforward controls and rugged build have made it a reliable choice for decades.",
                Summary = "Bright, twangy classic favored in country and rock.",
                Type = "Electric",
                Genres = new List<string> {"Country", "Rock", "Blues"},
                Pickups = new List<string> {"SS"},
                YearStart = 1950,
                YearEnd = null
            },
            new Guitar {
                Name = "Fender Mustang",
                PhotoUrl = "/images/guitars/fender-mustang.jpg",
                Description = "The Fender Mustang is a short-scale electric guitar known for its unique offset body and distinctive tone. It features single-coil pickups and a dynamic switching system, making it popular among alternative and indie rock players.\r\n\r\nIts comfortable playability and quirky sound have made it a cult favorite.",
                Summary = "Short-scale offset with a distinctive, quirky tone.",
                Type = "Electric",
                Genres = new List<string> {"Alternative", "Indie", "Rock", "Shoegaze", "Punk"},
                Pickups = new List<string> {"SS"},
                YearStart = 1964,
                YearEnd = null
            },
            new Guitar {
                Name = "Fender (Super) Stratocaster",
                PhotoUrl = "/images/guitars/super-strat.jpg",
                Description = "The Super Strat is a modified version of the classic Stratocaster, designed for higher performance and versatility. It often features humbucking pickups, a flatter fingerboard radius, and a double-locking tremolo system, making it ideal for shredders and modern rock players.\r\n\r\nIts enhanced playability and aggressive tone options set it apart from traditional Strats.",
                Summary = "High-performance Strat variant with humbuckers and advanced features.",
                Type = "Electric",
                Genres = new List<string> {"Rock", "Metal", "Progressive", "Grunge"},
                Pickups = new List<string> {"HSS", "HH"},
                YearStart = 1980,
                YearEnd = null
            },
            new Guitar {
                Name = "Gibson SG Standard",
                PhotoUrl = "/images/guitars/sg.jpg",
                Description = "The Gibson SG Standard is known for its sharp, aggressive tone and lightweight, double-cutaway design. With humbucking pickups and a fast neck, it's favored by rock and metal players for its sustain and playability.\r\n\r\nIts iconic look and powerful sound have made it a staple in the guitar world.",
                Summary = "Lightweight rock classic with sharp tone and fast neck.",
                Type = "Electric",
                Genres = new List<string> {"Rock", "Metal", "Blues"},
                Pickups = new List<string> {"HH"},
                YearStart = 1961,
                YearEnd = null
            },
            new Guitar {
                Name = "Martin D-28",
                PhotoUrl = "/images/guitars/d28.jpg",
                Description = "The Martin D-28 is a legendary acoustic guitar known for its rich, balanced tone and powerful projection. With a solid spruce top and rosewood back and sides, it delivers clarity and warmth, making it a favorite among folk, country, and bluegrass players.\r\n\r\nIts iconic design and exceptional craftsmanship have made it a benchmark in acoustic guitars.",
                Summary = "Iconic dreadnought acoustic with rich, balanced tone.",
                Type = "Acoustic",
                Genres = new List<string> {"Folk", "Country", "Bluegrass", "Rock"},
                Pickups = new List<string> {""},
                YearStart = 1931,
                YearEnd = null
            },
            new Guitar {
                Name = "Gibson Explorer",
                PhotoUrl = "/images/guitars/gibson-explorer.jpg",
                Description = "The Gibson Explorer is known for its radical, futuristic design and powerful humbucking pickups. It delivers a thick, aggressive tone with plenty of sustain, making it a favorite among hard rock and metal players.\r\n\r\nIts bold aesthetics and commanding sound have made it an enduring icon in the guitar world.",
                Summary = "Futuristic design with thick, aggressive tone.",
                Type = "Electric",
                Genres = new List<string> {"Rock", "Metal"},
                Pickups = new List<string> {"HH"},
                YearStart = 1958,
                YearEnd = null
            },
            new Guitar {
                Name = "Gibson Flying V",
                PhotoUrl = "/images/guitars/flying-v.jpg",
                Description = "The Gibson Flying V is renowned for its distinctive V-shaped body and powerful humbucking pickups. It offers a sharp, cutting tone with excellent sustain, making it a favorite among rock and metal guitarists.\r\n\r\nIts bold design and aggressive sound have cemented its status as a rock icon.",
                Summary = "Iconic V-shaped guitar with sharp, cutting tone.",
                Type = "Electric",
                Genres = new List<string> {"Rock", "Metal"},
                Pickups = new List<string> {"HH"},
                YearStart = 1958,
                YearEnd = null
            },
            new Guitar {
                Name = "Gibson ES-335",
                PhotoUrl = "/images/guitars/es335.jpg",
                Description = "Semi-hollow body guitar that blends the warmth of hollow bodies with the sustain of solid bodies.",
                Summary = "Versatile semi-hollow classic used in jazz, blues, and rock.",
                Type = "Electric",
                Genres = new List<string> {"Jazz", "Blues", "Rock"},
                Pickups = new List<string> {"HH"},
                YearStart = 1958,
                YearEnd = null
            },
            new Guitar {
                Name = "Fender Jazzmaster",
                PhotoUrl = "/images/guitars/fender-jazzmaster.jpg",
                Description = "Offset body guitar popular with alternative and surf rock players.",
                Summary = "Offset classic with bright, clear tones.",
                Type = "Electric",
                Genres = new List<string> {"Surf", "Alternative", "Rock"},
                Pickups = new List<string> {"SS"},
                YearStart = 1958,
                YearEnd = null
            },
        };
    }

    private static List<Amplifier> GetAmplifiers()
    {
        return new List<Amplifier>
    {
        new Amplifier {
            Name = "Marshall JCM900",
            PhotoUrl = "/images/amps/jcm900.jpg",
            Description = "The JCM900 series was introduced in 1990 as a successor to the iconic JCM800. It featured higher gain stages, more tonal options, and improved reliability. The JCM900 quickly became a favorite among rock and metal guitarists for its aggressive sound and versatility.",
            Summary = "Classic 90s Marshall tone, tight high-gain crunch.",
            IsTube = false,
            GainStructure = "High",
            YearStart = 1986,
            YearEnd = 2001,
            PriceStart = 900,
            PriceEnd = 2000,
            Wattage = 100,
            SpeakerConfiguration = "4x12",
            Manufacturer = "Marshall"
        },
        new Amplifier {
            Name = "Mesa/Boogie Dual Rectifier",
            PhotoUrl = "/images/amps/mesaboogie-dual-rec.jpg",
            Description = "Modern high-gain tube amp widely used for metal and heavy rock.",
            Summary = "Modern high-gain tube amp widely used for metal and heavy rock.",
            IsTube = true,
            GainStructure = "High",
            YearStart = 1992,
            YearEnd = null,
            PriceStart = 2000,
            PriceEnd = 2500,
            Wattage = 100,
            SpeakerConfiguration = "4x12",
            Manufacturer = "Mesa/Boogie"
        },
        new Amplifier {
            Name = "Fender Twin Reverb (Blonde)",
            PhotoUrl = "/images/amps/fender-twin.jpg",
            Description = "Amp first produced in 1963 and utilized by legends like Jimi Hendrix, The Rolling Stones and Pink Floyd.",
            Summary = "Amp first produced in 1963 and utilized by legends like Jimi Hendrix, The Rolling Stones and Pink Floyd.",
            IsTube = true,
            GainStructure = "Clean",
            YearStart = 1963,
            YearEnd = null,
            PriceStart = 1500,
            PriceEnd = 2000,
            Wattage = 85,
            SpeakerConfiguration = "2x12",
            Manufacturer = "Fender"
        },
         new Amplifier {
            Name = "Orange Rockerverb 50",
            PhotoUrl = "/images/amps/orange-rockerverb.jpg",
            Description = "High-end tube amplifier from Orange with rich harmonics and versatile tone.",
            Summary = "Premium British tube amp with built-in attenuator.",
            IsTube = true,
            GainStructure = "High",
            YearStart = 2006,
            YearEnd = null,
            PriceStart = 1800,
            PriceEnd = 2200,
            Wattage = 50,
            SpeakerConfiguration = "2x12",
            Manufacturer = "Orange"
        },
        new Amplifier {
            Name = "Vox AC15",
            PhotoUrl = "/images/amps/vox-ac15.jpg",
            Description = "Smaller version of the classic AC30 with the same chimey tone in a more manageable package.",
            Summary = "Classic Vox tone in a 15-watt package.",
            IsTube = true,
            GainStructure = "Clean",
            YearStart = 1998,
            YearEnd = null,
            PriceStart = 600,
            PriceEnd = 800,
            Wattage = 15,
            SpeakerConfiguration = "1x12",
            Manufacturer = "Vox"
        },
        new Amplifier {
            Name = "Fender Blues Junior",
            PhotoUrl = "/images/amps/fender-blues-junior.jpg",
            Description = "Popular tube combo amp known for its sweet overdrive and portability.",
            Summary = "Compact tube amp with classic Fender cleans and bluesy breakup.",
            IsTube = true,
            GainStructure = "Clean/Crunch",
            YearStart = 1995,
            YearEnd = null,
            PriceStart = 500,
            PriceEnd = 650,
            Wattage = 15,
            SpeakerConfiguration = "1x12",
            Manufacturer = "Fender"
        },
        new Amplifier {
            Name = "Peavey 5150",
            PhotoUrl = "/images/amps/peavey-5150.jpg",
            Description = "High-gain amplifier developed in collaboration with Eddie Van Halen, known for its aggressive tone.",
            Summary = "Iconic high-gain amp developed with Eddie Van Halen.",
            IsTube = true,
            GainStructure = "High",
            YearStart = 1992,
            YearEnd = 2004,
            PriceStart = 1000,
            PriceEnd = 1500,
            Wattage = 120,
            SpeakerConfiguration = "4x12",
            Manufacturer = "Peavey"
        },
        new Amplifier {
            Name = "Roland JC-120",
            PhotoUrl = "/images/amps/roland-jc120.jpg",
            Description = "Solid-state amplifier famous for its crystal-clean tones and built-in chorus effect.",
            Summary = "Iconic solid-state amp with legendary clean tones and chorus.",
            IsTube = false,
            GainStructure = "Clean",
            YearStart = 1975,
            YearEnd = null,
            PriceStart = 600,
            PriceEnd = 800,
            Wattage = 120,
            SpeakerConfiguration = "2x12",
            Manufacturer = "Roland"
        },
            // New amplifiers to reach 10+
            new Amplifier {
                Name = "Marshall DSL40CR",
                PhotoUrl = "/images/amps/marshall-dsl40cr.jpg",
                Description = "Modern Marshall combo amp with classic tone and versatility.",
                Summary = "Versatile tube combo with classic Marshall sound.",
                IsTube = true,
                GainStructure = "Crunch",
                YearStart = 2017,
                YearEnd = null,
                PriceStart = 800,
                PriceEnd = 1000,
                Wattage = 40,
                SpeakerConfiguration = "1x12",
                Manufacturer = "Marshall"
            },
            new Amplifier {
                Name = "Fender Princeton Reverb",
                PhotoUrl = "/images/amps/fender-princeton-reverb.jpg",
                Description = "Classic small tube combo known for its warm, rich tone and built-in reverb.",
                Summary = "Classic small tube combo with warm tone and reverb.",
                IsTube = true,
                GainStructure = "Clean",
                YearStart = 1964,
                YearEnd = null,
                PriceStart = 700,
                PriceEnd = 900,
                Wattage = 15,
                SpeakerConfiguration = "1x10",
                Manufacturer = "Fender"
            },
            new Amplifier {
                Name = "Vox AC30",
                PhotoUrl = "/images/amps/vox-ac30.jpg",
                Description = "The Vox AC30 is a legendary British combo amp introduced in 1959. Known for its bright, chimey tone and natural overdrive when cranked, it became synonymous with the sound of the British Invasion, used by bands like The Beatles, The Rolling Stones, and The Kinks.",
                Summary = "Chimey British amp popularized by the British Invasion",
                IsTube = true,
                GainStructure = "Crunch",
                YearStart = 1959,
                YearEnd = null,
                PriceStart = 1000,
                PriceEnd = 2000,
                Wattage = 30,
                SpeakerConfiguration = "2x12",
                Manufacturer = "Vox",
            },
           new Amplifier {
            Name = "Orange AD30",
            PhotoUrl = "/images/amps/orange-ad30.jpg",
            Description = "The Orange AD30 is a modern classic, first introduced in the late 1990s. Known for its thick British-voiced tone, warm mids, and smooth breakup, it delivers vintage-inspired crunch with a distinctive Orange character. It has become a go-to for rock players seeking a rich, harmonically complex sound.",
            Summary = "Thick British-voiced amp with warm mids and rounded low end.",
            IsTube = false,
            GainStructure = "Crunch",
            YearStart = 1999,
            YearEnd = null, 
            PriceStart = 1099,
            PriceEnd = 2300,
            Wattage = 30,
            SpeakerConfiguration = "2x12" , 
            Manufacturer = "Orange",
},

new Amplifier {
    Name = "Marshall Plexi (Super Lead 1959)",
    PhotoUrl = "/images/amps/marshall-plexi.jpg",
    Description = "Nicknamed the 'Plexi' for its plexiglass front panel, the Marshall Super Lead Model 1959 defined the sound of late 1960s and 1970s rock. Used by Jimi Hendrix, Jimmy Page, and countless others, its loud, raw, and crunchy tone became the blueprint for classic rock guitar amps.",
    Summary = "High-powered rock amp that defined the sound of the late '60s.",
    IsTube = true,
    GainStructure = "Crunch",
    YearStart = 1965,
    YearEnd = 1969, 
    PriceStart = 2000,
    PriceEnd = 3500,
    Wattage = 100,
    SpeakerConfiguration = "4x12",
    Manufacturer = "Marshall",
},
new Amplifier {
    Name = "Lab Series L5",
    PhotoUrl = "/images/amps/labseries-l5.jpg",
    Description = "A solid-state combo made in the late 1970s by Gibson/Norlin with design input from Moog. The L5 delivers 100W into two 12\" speakers, has two channels (clean & drive), built-in reverb, compressor/limiter, and tone-shaping features including a parametric mid and multifilter. Known for being loud, clean, and very versatile, with enough grit when pushed. Used by B.B. King, Ty Tabor, Allan Holdsworth, and more. :contentReference[oaicite:0]{index=0}",
    Summary = "100W solid-state powerhouse with clean headroom and versatile tone shaping.",
    IsTube = false,
    GainStructure = "Clean",
    YearStart = 1978,
    YearEnd = 1983,   
    PriceStart = 300, 
    PriceEnd = 600,    
    Wattage = 100,
    SpeakerConfiguration = "2x12",
    Manufacturer = "Lab Series (Gibson/Norlin)",
},
new Amplifier {
    Name = "Fender Deluxe Reverb",
    PhotoUrl = "/images/amps/fender-deluxe-reverb.jpg",
    Description = "The Fender Deluxe Reverb is a classic 1x12 tube combo amplifier first released in 1963. Revered for its clean, shimmering tone, spring reverb, and lush vibrato/tremolo, it's been a staple in studio and live settings. The ’65 reissue retains the original AB763 circuit style and delivers 22 watts through a 12\" speaker, with two channels (Normal & Vibrato).",
    Summary = "Iconic 22W Fender clean tone with reverb & vibrato - studio-quality classic.",
    IsTube = true,
    GainStructure = "Clean",
    YearStart = 1963,
    YearEnd = null,
    PriceStart = 1600, 
    PriceEnd = 1800,  
    Wattage = 22,
    SpeakerConfiguration = "1x12",
    Manufacturer = "Fender",
},
new Amplifier {
    Id = 16,
    Name = "Marshall JCM800",
    PhotoUrl = "/images/amps/marshall-jcm800.jpg",
    Description = "The Marshall JCM800 is one of the most iconic rock amplifiers ever made, produced from 1981 to 1991. Known for its aggressive, tight distortion and powerful midrange punch, it became the definitive sound of 1980s rock and metal. The JCM800's simple preamp design and hot-rodded tone made it a favorite among players like Zakk Wylde, Kerry King, and countless others seeking that classic Marshall crunch.",
    Summary = "Iconic 80s Marshall with tight, aggressive rock tone.",
    IsTube = true,
    GainStructure = "High",
    YearStart = 1981,
    YearEnd = 1991,
    PriceStart = 1200,
    PriceEnd = 2000,
    Wattage = 100,
    SpeakerConfiguration = "4x12",
    Manufacturer = "Marshall"
}
        };
    }

    private static List<Artist> GetArtists()
    {
        return new List<Artist>
        {
            new Artist {
                Name = "Zakk Wylde",
                PhotoUrl = "/images/artists/zakk-wylde.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/Zakk/zakk-hero.jpg",
                Tagline = "Renowned guitarist for Ozzy Osbourne and founder of Black Label Society.",
                Description = "Zakk Wylde early on with Ozzy Osbourne got his tone from his Gibson Les Paul Customs—most famously the bullseye model—loaded with EMG 81/85 pickups, cranked through Marshall JCM800s and JCM900s. This combo gave him the tight, high-gain crunch and searing sustain that defined his late-80s and 90s sound.\n\nWith Black Label Society, he doubled down on heaviness, sticking with EMG-equipped Les Pauls but pushing his Marshalls even harder for a thicker, more aggressive grind. His crushing rhythm tone and screaming pinch harmonics became trademarks of his massive, sludgy sound.\n\nIn recent years, Zakk has carried that formula into his own Wylde Audio guitars and amps. Built to capture the Les Paul-meets-Marshall recipe with his custom tweaks, they keep his tone consistent: huge, saturated, and instantly recognizable.",
                Summary = "Started with Ozzy, now leads Black Label Society with his signature heavy tone.",
                Bands = new List<string> {"Ozzy Osbourne", "Black Label Society", "Pantera"},
            },
            new Artist {
                Name = "Eddie Van Halen",
                PhotoUrl = "/images/artists/eddie-van-halen.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/EVH/evh-hero.jpg",
                Tagline = "Legendary Guitarist for Van Halen, popularized tapping.",
                Description = "Eddie Van Halen revolutionized electric guitar technique and tone in the late 1970s and 80s. He is best known for two-handed tapping, harmonics, and his high-gain, mid-forward sound built around modified amps and Frankenstrat guitars.\n\nHis playing inspired generations of rock and metal players and helped define the sound of modern rock guitar.",
                Summary = "Innovative rock guitarist famous for two-handed tapping and tone.",
                Bands = new List<string> {"Van Halen"}
            },
            new Artist {
                Name = "Stevie Ray Vaughan",
                PhotoUrl = "/images/artists/stevie-ray.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/SRV/stevie-ray-hero.jpg",
                Tagline = "Blues guitar legend known for fiery playing and soulful tone.",
                Description = "Stevie Ray Vaughan's tone was built around his Fender Stratocaster, often played through Fender and Marshall amplifiers. His use of single-coil pickups gave him a bright, cutting sound that was perfect for blues.\n\nVaughan's playing style was characterized by aggressive string bending, heavy vibrato, and a powerful attack. He often used overdrive and distortion pedals to push his amps into a gritty, saturated tone that became his signature sound. His soulful phrasing and impeccable timing made him one of the most influential blues guitarists of all time.",
                Summary = "Fiery blues guitarist with a soulful, cutting tone.",
                Bands = new List<string> {"Double Trouble"}
            },

            new Artist {
                Name = "David Gilmour",
                PhotoUrl = "/images/artists/david-gilmour.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/DG/gilmour-hero.jpg",
                Tagline = "Legendary guitarist for Pink Floyd, known for melodic solos and tone.",
                Description = "David Gilmour's iconic tone is built around his Fender Stratocaster and Telecaster guitars, often played through Hiwatt and Fender amplifiers. His use of single-coil pickups gives him a bright, articulate sound that cuts through the mix.\n\nGilmour is renowned for his expressive playing style, utilizing techniques like string bending, vibrato, and tasteful use of effects such as delay and reverb to create his signature soaring solos. His melodic approach and impeccable phrasing have made him one of the most influential guitarists in rock history.",
                Summary = "Pink Floyd's lead guitarist known for melodic solos and pristine tone.",
                Bands = new List<string> {"Pink Floyd"}
            },

            new Artist {
                Name = "John Mayer",
                PhotoUrl = "/images/artists/john-mayer.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/JM/mayer-hero.jpg",
                Tagline = "Grammy-winning singer-songwriter and guitarist known for bluesy pop-rock.",
                Description = "John Mayer's tone is characterized by his use of Fender Stratocaster guitars, often played through Two-Rock and Dumble amplifiers. His preference for single-coil pickups gives him a bright, clear sound that is perfect for his bluesy pop-rock style.\n\nMayer's playing style incorporates elements of blues, rock, and pop, with a focus on melodic phrasing and tasteful use of dynamics. He often employs techniques such as fingerpicking, hybrid picking, and subtle vibrato to add expression to his playing. His tone is further enhanced by his use of effects like delay and reverb, creating a spacious and atmospheric sound.",
                Summary = "Bluesy pop-rock guitarist and singer-songwriter with a smooth tone.",
                Bands = new List<string> {"John Mayer Trio", "Dead & Company"}
            },
            new Artist {
                Name = "B.B. King",
                PhotoUrl = "/images/artists/bb-king.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/BB/bb-hero.jpg",
                Tagline = "The King of Blues, known for his expressive vibrato and soulful playing.",
                Description = "B.B. King's tone was built around his Gibson ES-355 guitar, affectionately named 'Lucille,' often played through Fender and Ampeg amplifiers. His use of humbucking pickups gave him a warm, rich sound that was perfect for blues.\n\nKing's playing style was characterized by his expressive vibrato, precise string bending, and economical note choice. He often used a clean tone with a touch of overdrive to create a smooth, singing quality in his solos. His soulful phrasing and impeccable timing made him one of the most influential blues guitarists of all time.",
                Summary = "Blues legend known for his soulful tone and expressive vibrato.",
                Bands = new List<string> {"B.B. King and His Orchestra"}
            },
            new Artist {
                Name = "Slash",
                PhotoUrl = "/images/artists/slash.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/Slash/slash-hero.jpg",
                Tagline = "Iconic guitarist for Guns N' Roses, known for his bluesy rock solos.",
                Description = "Slash's tone is built around his Gibson Les Paul guitars, often played through Marshall amplifiers. His use of humbucking pickups gives him a thick, powerful sound that is perfect for hard rock.\n\nSlash's playing style incorporates elements of blues and rock, with a focus on melodic phrasing and expressive bends. He often uses techniques such as vibrato, slides, and double stops to add emotion to his solos. His tone is further enhanced by his use of effects like wah and delay, creating a dynamic and powerful sound.",
                Summary = "Guns N' Roses guitarist known for bluesy rock solos and iconic tone.",
                Bands = new List<string> {"Guns N' Roses", "Slash's Snakepit", "Velvet Revolver"}
            },
            new Artist {
                Name = "Carlos Santana",
                PhotoUrl = "/images/artists/santana.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/Santana/santana-hero.jpg",
                Tagline = "Latin rock legend known for his melodic playing and spiritual tone.",
                Description = "Carlos Santana's tone is built around his PRS guitars, often played through Mesa/Boogie and Fender amplifiers. His use of humbucking pickups gives him a warm, rich sound that is perfect for his Latin rock style.\n\nSantana's playing style incorporates elements of rock, blues, and Latin music, with a focus on melodic phrasing and expressive bends. He often uses techniques such as vibrato, slides, and legato to add emotion to his solos. His tone is further enhanced by his use of effects like delay and reverb, creating a spacious and atmospheric sound.",
                Summary = "Latin rock guitarist known for melodic solos and spiritual tone.",
                Bands = new List<string> {"Santana"}
            },
            new Artist {
                Name = "Jimi Hendrix",
                PhotoUrl = "/images/artists/jimi-hendrix.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/Jimi/hendrix-hero.jpg",
                Tagline = "Guitar revolutionary who changed music forever.",
                Description = "Jimi Hendrix revolutionized electric guitar playing with his innovative techniques and psychedelic approach to rock music",
                Summary = "Guitar legend, with 3 years of music he made a lifelong impact.",
                Bands = new List<string> {"The Jimi Hendrix Experience", "Band of Gypsys"}
            },

            new Artist {
                Name = "Eric Clapton",
                PhotoUrl = "/images/artists/clapton.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/EC/clapton-hero.jpg",
                Tagline = "Guitar legend known as Slowhand",
                Description = "Eric Clapton is one of the most influential guitarists in rock history, known for his work with Cream, Derek and the Dominos, and as a solo artist.",
                Summary = "Blues-rock guitar icon with a career spanning decades.",
                Bands = new List<string> {"Cream", "Derek and the Dominos", "The Yardbirds"}
            },
            new Artist {
                Name = "Jimmy Page",
                PhotoUrl = "/images/artists/jimmy-page.jpg",
                HeroPhotoUrl = "/images/artists/artistCont/JP/page-hero.jpg",
                Tagline = "Led Zeppelin's guitar wizard and producer",
                Description = "Jimmy Page crafted some of the most iconic guitar riffs in rock history with Led Zeppelin",
                Summary = "Led Zeppelin's iconic guitar legend and producer",
                Bands = new List<string> {"Led Zeppelin", "The Yardbirds"}

            }
        };
    }

    private static async Task EstablishRelationships(GearContext context)
    {
        // Get entities with their new IDs (after save)
        var allGuitars = await context.Guitars.ToListAsync();
        var allAmps = await context.Amplifiers.ToListAsync();
        var allArtists = await context.Artists.ToListAsync();

        // Helper function to safely find entities
        var findGuitar = (string name) => allGuitars.FirstOrDefault(g => g.Name == name);
        var findAmp = (string name) => allAmps.FirstOrDefault(a => a.Name == name);
        var findArtist = (string name) => allArtists.FirstOrDefault(a => a.Name == name);

        // === ARTIST-GUITAR RELATIONSHIPS (Real World Only) ===

        // Zakk Wylde - Les Paul Custom "Bullseye" primarily
        var zakkWylde = findArtist("Zakk Wylde");
        var lesPaul = findGuitar("Gibson Les Paul Standard");
        if (zakkWylde != null && lesPaul != null)
        {
            zakkWylde.Guitars.Add(lesPaul);
            lesPaul.Artists.Add(zakkWylde);
        }

        // Eddie Van Halen - Frankenstrat (represented by Super Strat)
        var eddieVH = findArtist("Eddie Van Halen");
        var superStrat = findGuitar("Fender (Super) Stratocaster");
        if (eddieVH != null && superStrat != null)
        {
            eddieVH.Guitars.Add(superStrat);
            superStrat.Artists.Add(eddieVH);
        }

        // Stevie Ray Vaughan - Stratocaster "Number One"
        var srv = findArtist("Stevie Ray Vaughan");
        var strat = findGuitar("Fender Stratocaster");
        if (srv != null && strat != null)
        {
            srv.Guitars.Add(strat);
            strat.Artists.Add(srv);
        }

        // David Gilmour - Black Stratocaster, Telecaster
        var davidGilmour = findArtist("David Gilmour");
        var tele = findGuitar("Fender Telecaster");
        if (davidGilmour != null && strat != null)
        {
            davidGilmour.Guitars.Add(strat);
            strat.Artists.Add(davidGilmour);
        }
        if (davidGilmour != null && tele != null)
        {
            davidGilmour.Guitars.Add(tele);
            tele.Artists.Add(davidGilmour);
        }

        // John Mayer - Stratocaster primarily
        var johnMayer = findArtist("John Mayer");
        if (johnMayer != null && strat != null)
        {
            johnMayer.Guitars.Add(strat);
            strat.Artists.Add(johnMayer);
        }

        // B.B. King - Gibson ES-355 "Lucille"
        var bbKing = findArtist("B.B. King");
        var es335 = findGuitar("Gibson ES-335"); // Closest to ES-355
        if (bbKing != null && es335 != null)
        {
            bbKing.Guitars.Add(es335);
            es335.Artists.Add(bbKing);
        }

        // Slash - Gibson Les Paul
        var slash = findArtist("Slash");
        if (slash != null && lesPaul != null)
        {
            slash.Guitars.Add(lesPaul);
            lesPaul.Artists.Add(slash);
        }

        // Carlos Santana - PRS guitars (not in our list, so Les Paul as substitute)
        var santana = findArtist("Carlos Santana");
        if (santana != null && lesPaul != null)
        {
            santana.Guitars.Add(lesPaul);
            lesPaul.Artists.Add(santana);
        }

        // Jimi Hendrix - Stratocaster primarily, Flying V occasionally
        var hendrix = findArtist("Jimi Hendrix");
        var flyingV = findGuitar("Gibson Flying V");
        if (hendrix != null && strat != null)
        {
            hendrix.Guitars.Add(strat);
            strat.Artists.Add(hendrix);
        }
        if (hendrix != null && flyingV != null)
        {
            hendrix.Guitars.Add(flyingV);
            flyingV.Artists.Add(hendrix);
        }

        // Eric Clapton - Stratocaster "Blackie", Les Paul, ES-335
        var clapton = findArtist("Eric Clapton");
        if (clapton != null && strat != null)
        {
            clapton.Guitars.Add(strat);
            strat.Artists.Add(clapton);
        }
        if (clapton != null && lesPaul != null)
        {
            clapton.Guitars.Add(lesPaul);
            lesPaul.Artists.Add(clapton);
        }
        if (clapton != null && es335 != null)
        {
            clapton.Guitars.Add(es335);
            es335.Artists.Add(clapton);
        }

        // Jimmy Page - Les Paul primarily, Telecaster for recordings
        var jimmyPage = findArtist("Jimmy Page");
        if (jimmyPage != null && lesPaul != null)
        {
            jimmyPage.Guitars.Add(lesPaul);
            lesPaul.Artists.Add(jimmyPage);
        }
        if (jimmyPage != null && tele != null)
        {
            jimmyPage.Guitars.Add(tele);
            tele.Artists.Add(jimmyPage);
        }

        // === ARTIST-AMPLIFIER RELATIONSHIPS (Real World Only) ===

        // Zakk Wylde - Marshall JCM800
        var jcm800 = findAmp("Marshall JCM800");
        if (zakkWylde != null && jcm800 != null)
        {
            zakkWylde.Amplifiers.Add(jcm800);
            jcm800.Artists.Add(zakkWylde);
        }

        // Eddie Van Halen - Peavey 5150 (he co-designed it)
        var peavey5150 = findAmp("Peavey 5150");
        if (eddieVH != null && peavey5150 != null)
        {
            eddieVH.Amplifiers.Add(peavey5150);
            peavey5150.Artists.Add(eddieVH);
        }

        // Stevie Ray Vaughan - Fender Deluxe Reverb
        var deluxeReverb = findAmp("Fender Deluxe Reverb");
        if (srv != null && deluxeReverb != null)
        {
            srv.Amplifiers.Add(deluxeReverb);
            deluxeReverb.Artists.Add(srv);
        }

        // David Gilmour - Fender Twin Reverb
        var twinReverb = findAmp("Fender Twin Reverb (Blonde)");
        if (davidGilmour != null && twinReverb != null)
        {
            davidGilmour.Amplifiers.Add(twinReverb);
            twinReverb.Artists.Add(davidGilmour);
        }

        // Jimi Hendrix - Marshall Plexi
        var plexi = findAmp("Marshall Plexi (Super Lead 1959)");
        if (hendrix != null && plexi != null)
        {
            hendrix.Amplifiers.Add(plexi);
            plexi.Artists.Add(hendrix);
        }

        // Jimmy Page - Marshall Plexi
        if (jimmyPage != null && plexi != null)
        {
            jimmyPage.Amplifiers.Add(plexi);
            plexi.Artists.Add(jimmyPage);
        }

        // B.B. King - Lab Series L5 (documented usage)
        var labSeriesL5 = findAmp("Lab Series L5");
        if (bbKing != null && labSeriesL5 != null)
        {
            bbKing.Amplifiers.Add(labSeriesL5);
            labSeriesL5.Artists.Add(bbKing);
        }

        // John Mayer - Fender Blues Junior, Princeton Reverb
        var bluesJunior = findAmp("Fender Blues Junior");
        var princetonReverb = findAmp("Fender Princeton Reverb");
        if (johnMayer != null && bluesJunior != null)
        {
            johnMayer.Amplifiers.Add(bluesJunior);
            bluesJunior.Artists.Add(johnMayer);
        }
        if (johnMayer != null && princetonReverb != null)
        {
            johnMayer.Amplifiers.Add(princetonReverb);
            princetonReverb.Artists.Add(johnMayer);
        }

        // Slash - Marshall JCM800
        if (slash != null && jcm800 != null)
        {
            slash.Amplifiers.Add(jcm800);
            jcm800.Artists.Add(slash);
        }

        // Carlos Santana - Mesa/Boogie Dual Rectifier
        var dualRec = findAmp("Mesa/Boogie Dual Rectifier");
        if (santana != null && dualRec != null)
        {
            santana.Amplifiers.Add(dualRec);
            dualRec.Artists.Add(santana);
        }

        // // === GUITAR-GUITAR RELATIONSHIPS (Model Evolution/Similarity) ===

        // // Fender family relationships
        var mustang = findGuitar("Fender Mustang");
        var jazzmaster = findGuitar("Fender Jazzmaster");

        // // Strat to Super Strat evolution
        if (strat != null && superStrat != null && tele != null && mustang != null && jazzmaster != null)
        {
            strat.RelatedGuitars.Add(superStrat);
            strat.RelatedGuitars.Add(tele);

            tele.RelatedGuitars.Add(strat);
            tele.RelatedGuitars.Add(superStrat);
            tele.RelatedGuitars.Add(jazzmaster);
            tele.RelatedGuitars.Add(mustang);

            superStrat.RelatedGuitars.Add(strat);

            mustang.RelatedGuitars.Add(jazzmaster);

            jazzmaster.RelatedGuitars.Add(mustang);
            jazzmaster.RelatedGuitars.Add(tele);
        }


        // // Gibson solid body family
        var sg = findGuitar("Gibson SG Standard");
        var explorer = findGuitar("Gibson Explorer");

        if (lesPaul != null && sg != null && es335 != null)
        {
            lesPaul.RelatedGuitars.Add(sg);
            lesPaul.RelatedGuitars.Add(es335);

            sg.RelatedGuitars.Add(lesPaul);
            sg.RelatedGuitars.Add(es335);

            es335.RelatedGuitars.Add(lesPaul);
            es335.RelatedGuitars.Add(sg);

        }

        // // Gibson radical shapes (Explorer, Flying V)
        if (explorer != null && flyingV != null)
        {
            explorer.RelatedGuitars.Add(flyingV);
            flyingV.RelatedGuitars.Add(explorer);
        }

        // // === AMPLIFIER-AMPLIFIER RELATIONSHIPS (Evolution/Family) ===

        // // Marshall evolution: Plexi -> JCM800 -> JCM900
        var jcm900 = findAmp("Marshall JCM900");
        if (plexi != null && jcm800 != null && jcm900 != null)
        {
            plexi.RelatedAmplifiers.Add(jcm800);
            plexi.RelatedAmplifiers.Add(jcm900);
            jcm800.RelatedAmplifiers.Add(plexi);
            jcm800.RelatedAmplifiers.Add(jcm900);
            jcm900.RelatedAmplifiers.Add(jcm800);
            jcm900.RelatedAmplifiers.Add(plexi);
        }


        // // Fender clean amp family
        if (twinReverb != null && deluxeReverb != null && bluesJunior != null && princetonReverb != null)
        {
            twinReverb.RelatedAmplifiers.Add(deluxeReverb);
            twinReverb.RelatedAmplifiers.Add(bluesJunior);
            twinReverb.RelatedAmplifiers.Add(princetonReverb);

            deluxeReverb.RelatedAmplifiers.Add(twinReverb);
            deluxeReverb.RelatedAmplifiers.Add(bluesJunior);
            deluxeReverb.RelatedAmplifiers.Add(princetonReverb);

            bluesJunior.RelatedAmplifiers.Add(princetonReverb);
            bluesJunior.RelatedAmplifiers.Add(deluxeReverb);
            bluesJunior.RelatedAmplifiers.Add(twinReverb);

            princetonReverb.RelatedAmplifiers.Add(twinReverb);
            princetonReverb.RelatedAmplifiers.Add(deluxeReverb);
            princetonReverb.RelatedAmplifiers.Add(bluesJunior);
        }
      

        // // Vox family
        var ac30 = findAmp("Vox AC30");
        var ac15 = findAmp("Vox AC15");
        if (ac30 != null && ac15 != null)
        {
            ac30.RelatedAmplifiers.Add(ac15);
            ac15.RelatedAmplifiers.Add(ac30);
        }

        // // Orange family
        var rockerverb = findAmp("Orange Rockerverb 50");
        var ad30 = findAmp("Orange AD30");
        if (rockerverb != null && ad30 != null)
        {
            rockerverb.RelatedAmplifiers.Add(ad30);
            ad30.RelatedAmplifiers.Add(rockerverb);
        }

        await context.SaveChangesAsync();
    }
}