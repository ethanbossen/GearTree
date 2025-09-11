using Microsoft.EntityFrameworkCore;
using GearTree.Models;

public class GearContext : DbContext
{
    public GearContext(DbContextOptions<GearContext> options) : base(options) { }

    public DbSet<Amplifier> Amplifiers { get; set; }
    public DbSet<Artist> Artists { get; set; }
    public DbSet<Guitar> Guitars { get; set; }

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Guitar.Genres -> JSON in DB
    modelBuilder.Entity<Guitar>()
        .Property(g => g.Genres)
        .HasConversion(
            v => string.Join(",", v),    // save as comma-separated string
            v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()
        );

    modelBuilder.Entity<Guitar>()
        .Property(g => g.Pickups)
        .HasConversion(
            v => string.Join(",", v),
            v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()
        );

    modelBuilder.Entity<Artist>()
        .Property(a => a.Bands)
        .HasConversion(
            v => string.Join(",", v),
            v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()
        );


    // Many-to-many relationships
    modelBuilder.Entity<Artist>()
        .HasMany(a => a.Amplifiers)
        .WithMany(b => b.Artists);

    modelBuilder.Entity<Artist>()
        .HasMany(a => a.Guitars)
        .WithMany(b => b.Artists);
}
}
