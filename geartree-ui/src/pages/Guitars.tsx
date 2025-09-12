// src/pages/Guitars.tsx
import { useEffect, useState } from "react";
import { Guitars as GuitarsAPI } from "../api";              // ✅ use the new namespace
import type { Guitar } from "../api";
import GuitarCard from "../components/GuitarCard";
import { Button, Collapse, MultiSelect, Select } from "@mantine/core";

function Guitars() {
  const [guitars, setGuitars] = useState<Guitar[]>([]); // ✅ use brief type
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [type, setType] = useState<string | null>(null);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [pickupFilter, setPickupFilter] = useState<string[]>([]);

  // Sorting
  const [sort, setSort] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    GuitarsAPI.list()                // ✅ updated
      .then(setGuitars)
      .catch(console.error);
  }, []);

  // Collect genres and pickups dynamically
  const allGenres = Array.from(
    new Set(guitars.flatMap((g) => g.genres || []))
  ).sort();

  const allPickups = Array.from(
    new Set(guitars.flatMap((g) => g.pickups || []))
  ).sort();

  // Filter + search logic
  const filteredGuitars = guitars.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.summary.toLowerCase().includes(search.toLowerCase());

    const matchesType = type ? g.type === type : true;

    const matchesGenre =
      genreFilter.length > 0
        ? g.genres?.some((genre) => genreFilter.includes(genre))
        : true;

    const matchesPickup =
      pickupFilter.length > 0
        ? g.pickups?.some((p) => pickupFilter.includes(p))
        : true;

    return matchesSearch && matchesType && matchesGenre && matchesPickup;
  });

  // Sorting logic
  const sortedGuitars = [...filteredGuitars].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "year-asc")
      return (a.yearStart || 0) - (b.yearStart || 0);
    if (sort === "year-desc")
      return (b.yearStart || 0) - (a.yearStart || 0);
    return 0;
  });

  return (
    <div className="px-8 max-w-7xl mx-auto">
      {/* Intro Section */}
      <section className="mb-10">
      
        <p className="text-lg text-gray-700 mb-4">
          Guitars are the heart and soul of modern music, capable of shaping
          everything from delicate melodies to walls of sound. More than just an
          instrument, the guitar has become a symbol of creativity, expression,
          and cultural identity. Whether electric, acoustic, or hybrid, each
          guitar carries a unique voice that inspires players and listeners
          alike.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Electric guitars in particular revolutionized the sound of the 20th
          century, introducing sustain, feedback, and tonal flexibility that
          reshaped entire genres. Acoustic guitars, with their resonance and
          warmth, continue to provide the foundation for countless songs,
          blending tradition with innovation.
        </p>
        <p className="text-lg text-gray-700">
          This section of the site is dedicated to exploring guitars of all
          kinds—from legendary models that defined eras to modern instruments
          that push boundaries. Here you can learn the stories, specs, and sound
          of each guitar while discovering how they shaped the artists and music
          we know today.
        </p>
      </section>

      {/* Search + Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search guitars..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full flex-[2] min-w-[250px] focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />

        <Button
          variant="outline"
          color="dark"
          onClick={() => setFiltersOpen((o) => !o)}
          className="mt-3 md:mt-0"
        >
          {filtersOpen ? "Hide Filters & Sort" : "Show Filters & Sort"}
        </Button>
      </div>

      {/* Collapsible Filters */}
      <Collapse in={filtersOpen}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Type */}
          <Select
            label="Type"
            placeholder="Filter by type"
            data={[
              { value: "Electric", label: "Electric" },
              { value: "Acoustic", label: "Acoustic" },
              { value: "Bass", label: "Bass" },
            ]}
            value={type}
            onChange={setType}
            clearable
          />

          {/* Genres */}
          <MultiSelect
            label="Genres"
            placeholder="Filter by genres"
            data={allGenres.map((g) => ({ value: g, label: g }))}
            value={genreFilter}
            onChange={setGenreFilter}
            searchable
            clearable
          />

          {/* Pickups */}
          <MultiSelect
            label="Pickups"
            placeholder="Filter by pickups"
            data={allPickups.map((p) => ({ value: p, label: p }))}
            value={pickupFilter}
            onChange={setPickupFilter}
            searchable
            clearable
          />

          {/* Sorting */}
          <Select
            label="Sort"
            placeholder="Sort guitars"
            data={[
              { value: "name-asc", label: "Name (A–Z)" },
              { value: "name-desc", label: "Name (Z–A)" },
              { value: "year-asc", label: "Oldest First" },
              { value: "year-desc", label: "Newest First" },
            ]}
            value={sort}
            onChange={setSort}
            clearable
          />
        </div>
      </Collapse>

      {/* Card Grid */}
      <div className="grid gap-8 md:grid-cols-3 pb-16">
        {sortedGuitars.slice(0, visibleCount).map((guitar) => (
          <GuitarCard
            key={guitar.id}
            id={guitar.id}
            name={guitar.name}
            summary={guitar.summary}
            photoUrl={guitar.photoUrl}
            type={guitar.type}
            genres={guitar.genres}
          />
        ))}
      </div>

      {/* Load More */}
      {sortedGuitars.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <Button onClick={() => setVisibleCount((c) => c + 9)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default Guitars;
