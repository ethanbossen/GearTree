import GenericListPage from "../components/GenericListPage";
import { useArtists } from "../api";
import type { Artist } from "../types";
import EntityCard from "../components/EntityCard";

function AllArtistsPage() {
  const artistFilterFunction = (artists: Artist[], filters: Record<string, any>) => {
    return artists.filter((artist) => {
      const matchesBand =
        filters.bandFilter === "all" || !filters.bandFilter || artist.bands.includes(filters.bandFilter);

      const matchesGear =
        filters.gearFilter === "all" || !filters.gearFilter ||
        (filters.gearFilter === "guitars" && artist.guitars.length > 0) ||
        (filters.gearFilter === "amps" && artist.amplifiers.length > 0);

      return matchesBand && matchesGear;
    });
  };

  const artistSortFunction = (artists: Artist[], sortValue: string) => {
    return [...artists].sort((a, b) => {
      if (sortValue === "az") return a.name.localeCompare(b.name);
      if (sortValue === "za") return b.name.localeCompare(a.name);
      return 0;
    });
  };

  const filterConfigs = [
    {
      key: 'bandFilter',
      label: 'Filter by Band',
      type: 'select' as const,
      placeholder: 'Choose a band',
      optionsFromData: (artists: Artist[]) => {
        const allBands = Array.from(new Set(artists.flatMap((artist) => artist.bands)));
        return [
          { value: "all", label: "All Bands" },
          ...allBands.map(band => ({ value: band, label: band }))
        ];
      },
      searchable: true
    },
    {
      key: 'gearFilter',
      label: 'Filter by Gear',
      type: 'select' as const,
      placeholder: 'Choose gear',
      options: [
        { value: "all", label: "All Gear" },
        { value: "guitars", label: "Has Guitars" },
        { value: "amps", label: "Has Amplifiers" },
      ],
      searchable: true
    }
  ];

  return (
    <GenericListPage<Artist>
      title="Artists"
      useQueryHook={useArtists} 
      renderItem={(artist) => (
        <EntityCard
          id={artist.id}
          basePath="artists"
          name={artist.name}
          summary={artist.summary}
          photoUrl={artist.photoUrl}
        />
      )}
      getItemKey={(artist) => artist.id}
      searchFields={['name', 'summary', 'tagline']}
      filterConfigs={filterConfigs}
      sortOptions={[
        { value: "az", label: "A–Z" },
        { value: "za", label: "Z–A" },
      ]}
      sortFunction={artistSortFunction}
      filterFunction={artistFilterFunction}
      gridCols="sm:grid-cols-2 lg:grid-cols-3"
      showRefreshButton
    />
  );
}

export default AllArtistsPage;
