// src/components/GenericListPage.tsx
import { useState } from "react";
import { Button, Collapse, Input, Select, MultiSelect, Checkbox, Loader, Alert } from "@mantine/core";
import type { UseQueryResult } from '@tanstack/react-query';

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
  useQueryHook: () => UseQueryResult<T[], Error>; // React Query hook instead of API call
  renderItem: (item: T) => React.ReactNode;
  getItemKey: (item: T) => string | number;
  searchFields: (keyof T)[];
  filterConfigs?: FilterConfig<T>[];
  sortOptions?: SortOption[];
  sortFunction?: (items: T[], sortValue: string) => T[];
  filterFunction?: (items: T[], filters: Record<string, any>) => T[];
  initialPageSize?: number;
  gridCols?: string;
  showRefreshButton?: boolean; // Option to show manual refresh
  enabledWhen?: boolean; // Control when query should be enabled
}

function GenericListPage<T>({
  title,
  introContent,
  useQueryHook,
  renderItem,
  getItemKey,
  searchFields,
  filterConfigs = [],
  sortOptions = [],
  sortFunction,
  filterFunction,
  initialPageSize = 9,
  gridCols = "sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  showRefreshButton = false,
}: GenericListPageProps<T>) {
  // React Query hook usage
  const { data: items = [], isLoading, error, refetch, isFetching } = useQueryHook();

  // Local state for UI controls
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(initialPageSize);
  const [filters, setFilters] = useState<Record<string, any>>({});

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

  // Loading state
  if (isLoading && items.length === 0) {
    return (
      <div className="px-8 pt-5 max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <Loader size="lg" className="mb-4" />
            <p className="text-gray-600">Loading {title.toLowerCase()}...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-8 pt-5 max-w-7xl mx-auto">
        <Alert color="red" title="Error loading data" className="mb-6">
          <p>{error.message}</p>
          <Button onClick={() => refetch()} className="mt-3" variant="outline">
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-8 pt-5 max-w-7xl mx-auto">
      {/* Intro Section */}
      {introContent && (
        <section className="prose max-w-none mb-10">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            {title}
            {isFetching && <Loader size="sm" />}
          </h1>
          {introContent}
        </section>
      )}

      {!introContent && (
        <h1 className="text-4xl font-bold mt-10 mb-8 border-b-4 inline-block border-[var(--brand-purple)] flex items-center gap-3">
          {title}
          {isFetching && <Loader size="sm" />}
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

        <div className="flex gap-2 mt-3 md:mt-0">
          {/* Filters Toggle */}
          {(currentFilterConfigs.length > 0 || sortOptions.length > 0) && (
            <Button
              variant="outline"
              color="dark"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              {filtersOpen ? "Hide Filters & Sort" : "Show Filters & Sort"}
            </Button>
          )}

          {/* Manual Refresh Button */}
          {showRefreshButton && (
            <Button
              variant="outline"
              color="blue"
              onClick={() => refetch()}
              loading={isFetching}
              loaderProps={{ size: 'xs' }}
            >
              Refresh
            </Button>
          )}
        </div>
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
      {sortedItems.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {search || Object.values(filters).some(f => f) ? 
              `No ${title.toLowerCase()} match your criteria.` : 
              `No ${title.toLowerCase()} found.`
            }
          </p>
          {(search || Object.values(filters).some(f => f)) && (
            <Button 
              variant="subtle" 
              onClick={() => {
                setSearch("");
                setFilters({});
                setSort(null);
              }}
              className="mt-3"
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}

      {/* Load More */}
      {visibleCount < sortedItems.length && (
        <div className="flex justify-center mb-5">
          <Button 
            onClick={() => setVisibleCount((c) => c + initialPageSize)}
            size="lg"
            className="bg-brand-purple hover:bg-brand-purple/90"
          >
            Load More
          </Button>
        </div>
      )}

      {/* Background refresh indicator */}
      {isFetching && items.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Loader size="xs" color="white" />
          <span className="text-sm">Refreshing...</span>
        </div>
      )}
    </div>
  );
}

export default GenericListPage;

