import { Badge } from "@/components/ui/badge";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface Filters {
  traits: string[];
  priceRange: string | null;
  sizes: string[];
}

interface FilterChipsProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const traitOptions = [
  { value: "vibrant", label: "Vibrant" },
  { value: "free-flying", label: "Free Flying" },
  { value: "talking", label: "Talking" },
  { value: "intelligent", label: "Intelligent" },
  { value: "human-bonding", label: "Human Bonding" },
];

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const priceRangeOptions = [
  { label: "Under ₹1L", value: "0-100000" },
  { label: "₹1L - ₹2L", value: "100000-200000" },
  { label: "₹2L - ₹3L", value: "200000-300000" },
  { label: "Above ₹3L", value: "300000-999999999" },
];

export default function FilterChips({ filters, onFilterChange }: FilterChipsProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleSectionToggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const toggleTrait = (trait: string) => {
    const newTraits = filters.traits.includes(trait)
      ? filters.traits.filter(t => t !== trait)
      : [...filters.traits, trait];
    onFilterChange({ ...filters, traits: newTraits });
  };

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const togglePriceRange = (range: string) => {
    onFilterChange({ 
      ...filters, 
      priceRange: filters.priceRange === range ? null : range 
    });
  };

  const clearAll = () => {
    onFilterChange({ traits: [], priceRange: null, sizes: [] });
  };

  const hasActiveFilters = filters.traits.length > 0 || filters.priceRange !== null || filters.sizes.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Filter Birds</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-4">
        <Collapsible open={openSection === 'traits'} onOpenChange={() => handleSectionToggle('traits')} className="border-b pb-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover-elevate p-2 rounded-md" data-testid="toggle-traits">
            <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Bird Traits</p>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === 'traits' ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="flex flex-col gap-2">
              {traitOptions.map((trait) => (
                <label
                  key={trait.value}
                  className="flex items-center gap-2 cursor-pointer hover-elevate p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.traits.includes(trait.value)}
                    onChange={() => toggleTrait(trait.value)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    data-testid={`filter-trait-${trait.value}`}
                  />
                  <span className="text-sm text-foreground">{trait.label}</span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSection === 'size'} onOpenChange={() => handleSectionToggle('size')} className="border-b pb-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover-elevate p-2 rounded-md" data-testid="toggle-size">
            <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Size</p>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === 'size' ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="flex flex-col gap-2">
              {sizeOptions.map((size) => (
                <label
                  key={size.value}
                  className="flex items-center gap-2 cursor-pointer hover-elevate p-2 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size.value)}
                    onChange={() => toggleSize(size.value)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                    data-testid={`filter-size-${size.value}`}
                  />
                  <span className="text-sm text-foreground">{size.label}</span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSection === 'price'} onOpenChange={() => handleSectionToggle('price')} className="pt-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover-elevate p-2 rounded-md" data-testid="toggle-price">
            <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Price Range</p>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openSection === 'price' ? 'rotate-180' : ''}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="flex flex-col gap-2">
              {priceRangeOptions.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center gap-2 cursor-pointer hover-elevate p-2 rounded-md transition-colors"
                >
                  <input
                    type="radio"
                    checked={filters.priceRange === range.value}
                    onChange={() => togglePriceRange(range.value)}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    data-testid={`filter-price-${range.value}`}
                  />
                  <span className="text-sm text-foreground">{range.label}</span>
                </label>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <p className="text-xs font-medium text-muted-foreground mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {filters.traits.map((trait) => (
                <Badge key={trait} variant="default" className="text-xs">
                  {traitOptions.find(t => t.value === trait)?.label}
                  <button
                    onClick={() => toggleTrait(trait)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.sizes.map((size) => (
                <Badge key={size} variant="default" className="text-xs">
                  {sizeOptions.find(s => s.value === size)?.label}
                  <button
                    onClick={() => toggleSize(size)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {filters.priceRange && (
                <Badge variant="default" className="text-xs">
                  {priceRangeOptions.find(r => r.value === filters.priceRange)?.label}
                  <button
                    onClick={() => togglePriceRange(filters.priceRange!)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
