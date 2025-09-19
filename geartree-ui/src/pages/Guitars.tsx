import GenericListPage from "../components/GenericListPage";
import { useGuitars } from "../api";
import type { Guitar } from "../types";
import GuitarCard from "../components/Wrappers/GuitarCardDetailed";

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
        Guitars are the heart and soul of modern music...
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Electric guitars revolutionized the sound of the 20th century...
      </p>
      <p className="text-lg text-gray-700">
        This section is dedicated to exploring guitars of all kinds...
      </p>
    </>
  );

  return (
    <GenericListPage<Guitar>
      title="Explore Guitars"
      introContent={introContent}
      useQueryHook={useGuitars}           // <-- React Query hook
      renderItem={(guitar) => (
        <GuitarCard {...guitar} />
      )}
      getItemKey={(guitar) => guitar.id}
      searchFields={['name', 'summary']}
      sortOptions={[
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "name-desc", label: "Name (Z–A)" },
        { value: "year-asc", label: "Oldest First" },
        { value: "year-desc", label: "Newest First" },
      ]}
      sortFunction={guitarSortFunction}
      filterFunction={guitarFilterFunction}
      filterConfigs={filterConfigs}
      showRefreshButton
    />
  );
}

export default Guitars;
