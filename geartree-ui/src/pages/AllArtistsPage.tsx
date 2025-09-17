// src/pages/Artists.tsx
import { useEffect, useState } from "react";
import { Artists } from "../api";
import type { Artist } from "../api";
import ArtistCard from "../components/ArtistCard";
import { Button, Collapse, Input, Select } from "@mantine/core";

function AllArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState("");
  const [bandFilter, setBandFilter] = useState("all");
  const [gearFilter, setGearFilter] = useState("all");
  const [sort, setSort] = useState("az");
  const [visibleCount, setVisibleCount] = useState(9);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    Artists.list()
      .then((data) => setArtists(data))
      .catch(console.error);
  }, []);

  const allBands = Array.from(new Set(artists.flatMap((artist) => artist.bands)));

  const filteredArtists = artists
    .filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(search.toLowerCase()) ||
        artist.summary.toLowerCase().includes(search.toLowerCase()) ||
        artist.tagline.toLowerCase().includes(search.toLowerCase());

      const matchesBand =
        bandFilter === "all" || artist.bands.includes(bandFilter);

      const matchesGear =
        gearFilter === "all" ||
        (gearFilter === "guitars" && artist.guitars.length > 0) ||
        (gearFilter === "amps" && artist.amplifiers.length > 0);

      return matchesSearch && matchesBand && matchesGear;
    })
    .sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "za") return b.name.localeCompare(a.name);
      return 0;
    });

  const visibleArtists = filteredArtists.slice(0, visibleCount);

  return (
    <div className="px-8 max-w-7xl mx-auto">
      {/* Page title */}
      <h1 className="text-4xl font-bold mt-10 mb-8 border-b-4 inline-block border-[var(--brand-purple)]">
        Artists
      </h1>

      {/* Search + Filter Row */}
    <div className="flex flex-col w-full md:flex-row md:items-center md:space-x-4 mb-6">
          <Input
          type="text"
          placeholder="Search artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg w-full flex-[2] min-w-[250px]"
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

      {/* Filter/Sort Panel */}
      <Collapse in={filtersOpen}>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {/* Band Filter */}
          <Select
            label="Filter by Band"
            placeholder="Choose a band"
            searchable
            nothingFoundMessage="No bands found"
            data={["all", ...allBands]}
            value={bandFilter}
            onChange={(value) => setBandFilter(value || "all")}
          />

          {/* Gear Filter */}
          <Select
            label="Filter by Gear"
            placeholder="Choose gear"
            searchable
            data={[
              { value: "all", label: "All Gear" },
              { value: "guitars", label: "Has Guitars" },
              { value: "amps", label: "Has Amplifiers" },
            ]}
            value={gearFilter}
            onChange={(value) => setGearFilter(value || "all")}
          />

          {/* Sort */}
          <Select
            label="Sort"
            data={[
              { value: "az", label: "A–Z" },
              { value: "za", label: "Z–A" },
            ]}
            value={sort}
            onChange={(value) => setSort(value || "az")}
          />
        </div>
      </Collapse>

      {/* Grid of Artist Cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleArtists.map((artist) => (
          <div key={artist.id} className="pb-6">
            <ArtistCard
              id={artist.id}
              name={artist.name}
              summary={artist.summary}
              photoUrl={artist.photoUrl}
            />
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredArtists.length === 0 && (
        <p className="text-gray-500 mt-8">No artists found.</p>
      )}

      {/* Load More Button */}
      {visibleCount < filteredArtists.length && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="px-6 mb-8 bg-brand-purple text-white font-semibold rounded-lg shadow hover:bg-brand-purple/90"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default AllArtistsPage;
