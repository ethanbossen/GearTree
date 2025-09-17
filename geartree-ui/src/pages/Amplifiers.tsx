// src/pages/Amplifiers.tsx
import { useEffect, useState } from "react";
import { Amps } from "../api";
import type { Amplifier } from "../api";
import AmpCardDetailed from "../components/AmpCardDetailed";
import { Button, Collapse, Input, Select, MultiSelect, Checkbox } from "@mantine/core";

function Amplifiers() {
  const [amps, setAmps] = useState<Amplifier[]>([]);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  // Filters
  const [tubeOnly, setTubeOnly] = useState<boolean | null>(null);
  const [selectedGain, setSelectedGain] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [wattageRange, setWattageRange] = useState<string | null>(null);

  useEffect(() => {
    Amps.list().then(setAmps).catch(console.error);
  }, []);

  // Unique lists for filter dropdowns
  const gainOptions = Array.from(new Set(amps.map((a) => a.gainStructure).filter(Boolean))).map(
    (g) => ({ value: g, label: g })
  );
  const manufacturerOptions = Array.from(new Set(amps.map((a) => a.manufacturer).filter(Boolean))).map(
    (m) => ({ value: m, label: m })
  );

  // Filter + search logic
  const filteredAmps = amps.filter((amp) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      amp.name.toLowerCase().includes(searchLower) ||
      amp.manufacturer.toLowerCase().includes(searchLower) ||
      amp.speakerConfiguration.toLowerCase().includes(searchLower) ||
      amp.gainStructure.toLowerCase().includes(searchLower);

    const matchesTube =
      tubeOnly === null ? true : tubeOnly ? amp.isTube : !amp.isTube;

    const matchesGain =
      selectedGain.length === 0 || selectedGain.includes(amp.gainStructure);

    const matchesManufacturer =
      selectedManufacturers.length === 0 ||
      selectedManufacturers.includes(amp.manufacturer);

    const matchesWattage =
      !wattageRange ||
      (wattageRange === "0-15" && amp.wattage <= 15) ||
      (wattageRange === "15-30" && amp.wattage > 15 && amp.wattage <= 30) ||
      (wattageRange === "30-60" && amp.wattage > 30 && amp.wattage <= 60) ||
      (wattageRange === "60+" && amp.wattage > 60);

    return (
      matchesSearch &&
      matchesTube &&
      matchesGain &&
      matchesManufacturer &&
      matchesWattage
    );
  });

  // Sorting logic
  const sortedAmps = [...filteredAmps].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    if (sort === "year-asc") return (a.yearStart || 0) - (b.yearStart || 0);
    if (sort === "year-desc") return (b.yearStart || 0) - (a.yearStart || 0);
    return 0;
  });

  return (
    <div className="px-8 pt-5 max-w-7xl mx-auto">
      {/* Intro body section */}
      <section className="prose max-w-none mb-10">
        <h1 className="text-4xl font-bold mb-4">Explore Amplifiers</h1>
        <p className="text-lg text-gray-700 mb-4">
          Guitar amplifiers are at the core of every great tone, transforming the vibrations of the strings into a voice that can fill a room or shake an arena.
          They aren’t just about volume—they shape the character, feel, and dynamics of a player’s sound. From shimmering cleans to heavy distortion, 
          the amp often defines the style of music as much as the guitar itself.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          At their heart, amplifiers generally come in two main types: tube and
          solid-state. Tube amps are celebrated for their warmth and responsive
          feel, while solid-state amps deliver reliable performance and clean
          tone. Both have their strengths, and many players use them side by
          side.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          This section of the site is dedicated to exploring amplifiers of all
          kinds—from classic icons that defined generations to modern designs
          pushing the limits of technology.
        </p>
      </section>

      {/* Search + Filter Toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
              <Input
                type="text"
                placeholder="Search amplifiers..."
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

      {/* Filters + Sort */}
      <Collapse in={filtersOpen}>
        <div className="mb-6 space-y-4">
          <Select
            label="Sort By"
            placeholder="Choose..."
            value={sort}
            onChange={setSort}
            data={[
              { value: "name-asc", label: "Name (A–Z)" },
              { value: "name-desc", label: "Name (Z–A)" },
              { value: "year-asc", label: "Year (Oldest First)" },
              { value: "year-desc", label: "Year (Newest First)" },
            ]}
            clearable
          />

          <Checkbox
            label="Tube Amps Only"
            checked={tubeOnly === true}
            indeterminate={tubeOnly === null}
            onChange={() =>
              setTubeOnly(tubeOnly === null ? true : tubeOnly ? false : null)
            }
          />

          <MultiSelect
            label="Gain Structure"
            placeholder="Select gain types"
            data={gainOptions}
            value={selectedGain}
            onChange={setSelectedGain}
            searchable
            clearable
          />

          <MultiSelect
            label="Manufacturer"
            placeholder="Select manufacturers"
            data={manufacturerOptions}
            value={selectedManufacturers}
            onChange={setSelectedManufacturers}
            searchable
            clearable
          />

          <Select
            label="Wattage Range"
            placeholder="Choose..."
            value={wattageRange}
            onChange={setWattageRange}
            data={[
              { value: "0-15", label: "0–15W" },
              { value: "15-30", label: "15–30W" },
              { value: "30-60", label: "30–60W" },
              { value: "60+", label: "60W+" },
            ]}
            clearable
          />
        </div>
      </Collapse>

      {/* Amp Grid */}
      <div className="grid gap-8 md:grid-cols-3 mb-12">
        {sortedAmps.slice(0, visibleCount).map((amp) => (
          <AmpCardDetailed key={amp.id} {...amp} />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < sortedAmps.length && (
        <div className="flex justify-center">
          <button 
          onClick={() => setVisibleCount((c) => c + 9)}
          className="px-6 mb-8 bg-brand-purple text-white font-semibold rounded-lg shadow hover:bg-brand-purple/90">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default Amplifiers;
