import { useState } from 'react';
import FilterChips, { type Filters } from '../FilterChips';

export default function FilterChipsExample() {
  const [filters, setFilters] = useState<Filters>({
  traits: [],
  priceRange: null,
  sizes: []
});

  return (
    <div className="p-6 max-w-md">
      <FilterChips filters={filters} onFilterChange={setFilters} />
    </div>
  );
}
