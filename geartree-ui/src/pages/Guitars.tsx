// src/pages/Guitars.tsx
import { useMemo } from "react";
import GenericListPage from "../components/GenericListPage";
import { Guitars as GuitarsAPI } from "../api";
import type { Guitar } from "../types";
import GuitarCard from "../components/GuitarCardDetailed";

function Guitars() {
  const guitarFilterFunction = (guitars: Guitar[], filters: Record<string, any>) => {
    return guitars.filter((g) => {
      const matchesType = filters.type ? g.type === filters.type : true;
      const matchesGenre = filters.genreFilter?.length > 0
        ? g.genres?.some((genre: string) => filters.genreFilter.includes(genre))
        : true;
      const matchesPickup = filters.pickupFilter?.length > 0
        ? g.pickups?.some((p: string) => filters.pickupFilter.includes(p))
        : true;

      return matchesType && matchesGenre && matchesPickup;
    });
  };

  const guitarSortFunction = (guitars: Guitar[], sortValue: string) => {
    return [...guitars].sort((a, b) => {
      if (sortValue === "name-asc") return a.name.localeCompare(b.name);
      if (sortValue === "name-desc") return b.name.localeCompare(a.name);
      if (sortValue === "year-asc") return (a.yearStart || 0) - (b.yearStart || 0);
      if (sortValue === "year-desc") return (b.yearStart || 0) - (a.yearStart || 0);
      return 0;
    });
  };

  const filterConfigs = [
    {
      key: 'type',
      label: 'Type',
      type: 'select' as const,
      placeholder: 'Filter by type',
      options: [
        { value: 'Electric', label: 'Electric' },
        { value: 'Acoustic', label: 'Acoustic' },
      ]
    },
    {
      key: 'genreFilter',
      label: 'Genres',
      type: 'multiselect' as const,
      placeholder: 'Filter by genres',
      optionsFromData: (guitars: Guitar[]) => {
        const allGenres = Array.from(new Set(guitars.flatMap((g) => g.genres || []))).sort();
        return allGenres.map((g) => ({ value: g, label: g }));
      },
      searchable: true
    },
    {
      key: 'pickupFilter',
      label: 'Pickups',
      type: 'multiselect' as const,
      placeholder: 'Filter by pickups',
      optionsFromData: (guitars: Guitar[]) => {
        const allPickups = Array.from(new Set(guitars.flatMap((g) => g.pickups || []))).sort();
        return allPickups.map((p) => ({ value: p, label: p }));
      },
      searchable: true
    }
  ];

  const introContent = (
    <>
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
    </>
  );

  return (
    <GenericListPage
      title="Explore Guitars"
      introContent={introContent}
      apiCall={GuitarsAPI.list}
      renderItem={(guitar: Guitar) => (
        <GuitarCard
          id={guitar.id}
          name={guitar.name}
          summary={guitar.summary}
          photoUrl={guitar.photoUrl}
          type={guitar.type}
          genres={guitar.genres}
          yearStart={guitar.yearStart}
          yearEnd={guitar.yearEnd}
        />
      )}
      getItemKey={(guitar: Guitar) => guitar.id}
      searchFields={['name', 'summary'] as (keyof Guitar)[]}
      sortOptions={[
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "name-desc", label: "Name (Z–A)" },
        { value: "year-asc", label: "Oldest First" },
        { value: "year-desc", label: "Newest First" },
      ]}
      sortFunction={guitarSortFunction}
      filterFunction={guitarFilterFunction}
      filterConfigs={filterConfigs}
    />
  );
}

export default Guitars;