import GenericListPage from "../components/GenericListPage";
import { useAmps } from "../api";
import type { Amplifier } from "../types";
import AmpCardDetailed from "../components/Wrappers/AmpCardDetailed";

function Amplifiers() {
  const ampFilterFunction = (amps: Amplifier[], filters: Record<string, any>) => {
    return amps.filter((amp) => {
      const matchesAmpType =
        !filters.ampType || filters.ampType === 'both'
          ? true
          : filters.ampType === 'tube'
          ? amp.isTube
          : !amp.isTube;

      const matchesGain =
        !filters.selectedGain || filters.selectedGain.length === 0 || 
        filters.selectedGain.includes(amp.gainStructure);

      const matchesManufacturer =
        !filters.selectedManufacturers || filters.selectedManufacturers.length === 0 ||
        filters.selectedManufacturers.includes(amp.manufacturer);

      const matchesWattage =
        !filters.wattageRange ||
        (filters.wattageRange === "0-15" && amp.wattage <= 15) ||
        (filters.wattageRange === "15-30" && amp.wattage > 15 && amp.wattage <= 30) ||
        (filters.wattageRange === "30-60" && amp.wattage > 30 && amp.wattage <= 60) ||
        (filters.wattageRange === "60+" && amp.wattage > 60);

      return matchesAmpType && matchesGain && matchesManufacturer && matchesWattage;
    });
  };

  const ampSortFunction = (amps: Amplifier[], sortValue: string) => {
    return [...amps].sort((a, b) => {
      if (sortValue === "name-asc") return a.name.localeCompare(b.name);
      if (sortValue === "name-desc") return b.name.localeCompare(a.name);
      if (sortValue === "year-asc") return (a.yearStart || 0) - (b.yearStart || 0);
      if (sortValue === "year-desc") return (b.yearStart || 0) - (a.yearStart || 0);
      return 0;
    });
  };

  const filterConfigs = [
    {
      key: 'ampType',
      label: 'Amplifier Type',
      type: 'select' as const,
      placeholder: 'Choose...',
      options: [
        {value: 'both', label: 'Tube and Solid State'},
        {value: 'tube', label: 'Tube Amps Only'},
        {value: 'solidstate', label: 'Solid State Only'}
      ]
    },
    {
      key: 'selectedGain',
      label: 'Gain Structure',
      type: 'multiselect' as const,
      placeholder: 'Select gain types',
      optionsFromData: (amps: Amplifier[]) => {
        const gainOptions = Array.from(new Set(amps.map((a) => a.gainStructure).filter(Boolean)));
        return gainOptions.map((g) => ({ value: g, label: g }));
      },
      searchable: true
    },
    {
      key: 'selectedManufacturers',
      label: 'Manufacturer',
      type: 'multiselect' as const,
      placeholder: 'Select manufacturers',
      optionsFromData: (amps: Amplifier[]) => {
        const manufacturerOptions = Array.from(new Set(amps.map((a) => a.manufacturer).filter(Boolean)));
        return manufacturerOptions.map((m) => ({ value: m, label: m }));
      },
      searchable: true
    },
    {
      key: 'wattageRange',
      label: 'Wattage Range',
      type: 'select' as const,
      placeholder: 'Choose...',
      options: [
        { value: "0-15", label: "0–15W" },
        { value: "15-30", label: "15–30W" },
        { value: "30-60", label: "30–60W" },
        { value: "60+", label: "60W+" },
      ]
    }
  ];

  const introContent = (
    <>
      <p className="text-lg text-gray-700 mb-4">
        Guitar amplifiers are at the core of every great tone, transforming the vibrations of the strings into a voice that can fill a room or shake an arena.
        They aren't just about volume—they shape the character, feel, and dynamics of a player's sound. From shimmering cleans to heavy distortion, 
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
    </>
  );

  return (
    <GenericListPage<Amplifier>
      title="Explore Amplifiers"
      introContent={introContent}
      useQueryHook={useAmps} 
      renderItem={(amp) => <AmpCardDetailed {...amp} />}
      getItemKey={(amp) => amp.id}
      searchFields={['name', 'manufacturer', 'speakerConfiguration', 'gainStructure']}
      filterConfigs={filterConfigs}
      sortOptions={[
        { value: "name-asc", label: "Name (A–Z)" },
        { value: "name-desc", label: "Name (Z–A)" },
        { value: "year-asc", label: "Year (Oldest First)" },
        { value: "year-desc", label: "Year (Newest First)" },
      ]}
      sortFunction={ampSortFunction}
      filterFunction={ampFilterFunction}
      showRefreshButton
    />
  );
}

export default Amplifiers;
