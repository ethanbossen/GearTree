// src/components/GenericListPage.tsx
import { useEffect, useState } from "react";
import { Button, Collapse, Input, Select, MultiSelect, Checkbox } from "@mantine/core";

interface FilterConfig<T> {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'checkbox';
  options?: Array<{ value: string; label: string }>;
  optionsFromData?: (items: T[]) => Array<{ value: string; label: string }>;
  placeholder?: string;
  searchable?: boolean;
}

interface SortOption {
  value: string;
  label: string;
}

interface GenericListPageProps<T> {
  title: string;
  introContent?: React.ReactNode;
  apiCall: () => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string | number;
  searchFields: (keyof T)[];
  filterConfigs?: FilterConfig<T>[];
  sortOptions?: SortOption[];
  sortFunction?: (items: T[], sortValue: string) => T[];
  filterFunction?: (items: T[], filters: Record<string, any>) => T[];
  initialPageSize?: number;
  gridCols?: string;
}

function GenericListPage<T>({
  title,
  introContent,
  apiCall,
  renderItem,
  getItemKey,
  searchFields,
  filterConfigs = [],
  sortOptions = [],
  sortFunction,
  filterFunction,
  initialPageSize = 9,
  gridCols = "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
}: GenericListPageProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialPageSize);
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    apiCall()
      .then(setItems)
      .catch(console.error);
  }, [apiCall]);

  // Generic search logic
  const searchFilter = (item: T): boolean => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return searchFields.some(field => {
      const value = item[field];
      if (typeof value === 'string') {
        return value.toLowerCase().includes(searchLower);
      }
      if (Array.isArray(value)) {
        return value.some(v => 
          typeof v === 'string' && v.toLowerCase().includes(searchLower)
        );
      }
      return false;
    });
  };

  // Generate current filter configs with data-driven options
  const currentFilterConfigs = filterConfigs?.map(config => ({
    ...config,
    options: config.optionsFromData ? config.optionsFromData(items) : config.options
  })) || [];

  // Apply search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = searchFilter(item);
    const matchesFilters = filterFunction ? 
      filterFunction([item], filters).length > 0 : 
      true;
    return matchesSearch && matchesFilters;
  });

  // Apply sorting
  const sortedItems = sortFunction && sort ? 
    sortFunction(filteredItems, sort) : 
    filteredItems;

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderFilterControl = (config: FilterConfig<T> & { options?: Array<{ value: string; label: string }> }) => {
    const value = filters[config.key];
    const options = config.options || [];

    switch (config.type) {
      case 'select':
        return (
          <Select
            key={config.key}
            label={config.label}
            placeholder={config.placeholder}
            data={options}
            value={value || null}
            onChange={(val) => updateFilter(config.key, val)}
            searchable={config.searchable}
            clearable
          />
        );
      
      case 'multiselect':
        return (
          <MultiSelect
            key={config.key}
            label={config.label}
            placeholder={config.placeholder}
            data={options}
            value={value || []}
            onChange={(val) => updateFilter(config.key, val)}
            searchable={config.searchable}
            clearable
          />
        );
      
      case 'checkbox':
        return (
          <div key={config.key} className="flex flex-col">
            <label className="text-sm font-medium mb-2">{config.label}</label>
            <Checkbox
              checked={value === true}
              indeterminate={value === null}
              onChange={() => 
                updateFilter(config.key, value === null ? true : value ? false : null)
              }
              className="mt-1"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="px-8 pt-5 max-w-7xl mx-auto">
      {/* Intro Section */}
      {introContent && (
        <section className="prose max-w-none mb-10">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          {introContent}
        </section>
      )}

      {!introContent && (
        <h1 className="text-4xl font-bold mt-10 mb-8 border-b-4 inline-block border-[var(--brand-purple)]">
          {title}
        </h1>
      )}

      {/* Search + Filter Row */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
        <Input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg w-full flex-[2] min-w-[250px]"
        />

        {(currentFilterConfigs.length > 0 || sortOptions.length > 0) && (
          <Button
            variant="outline"
            color="dark"
            onClick={() => setFiltersOpen((o) => !o)}
            className="mt-3 md:mt-0"
          >
            {filtersOpen ? "Hide Filters & Sort" : "Show Filters & Sort"}
          </Button>
        )}
      </div>

      {/* Collapsible Filters */}
      {(currentFilterConfigs.length > 0 || sortOptions.length > 0) && (
        <Collapse in={filtersOpen}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Sort Options */}
            {sortOptions.length > 0 && (
              <Select
                label="Sort"
                placeholder="Sort items"
                data={sortOptions}
                value={sort}
                onChange={setSort}
                clearable
              />
            )}

            {/* Dynamic Filter Controls */}
            {currentFilterConfigs.map(renderFilterControl)}
          </div>
        </Collapse>
      )}

      {/* Items Grid */}
      <div className={`grid gap-8 ${gridCols} pb-8`}>
        {sortedItems.slice(0, visibleCount).map((item) => (
          <div key={getItemKey(item)}>
            {renderItem(item)}
          </div>
        ))}
      </div>

      {/* No Results */}
      {sortedItems.length === 0 && (
        <p className="text-gray-500 mt-8">No {title.toLowerCase()} found.</p>
      )}

      {/* Load More */}
      {visibleCount < sortedItems.length && (
        <div className="flex justify-center mb-5">
          <button 
            onClick={() => setVisibleCount((c) => c + initialPageSize)}
            className="px-6 bg-brand-purple text-white font-semibold rounded-lg shadow hover:bg-brand-purple/90"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default GenericListPage;