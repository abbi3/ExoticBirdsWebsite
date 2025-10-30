import PriceBadge from '../PriceBadge';

export default function PriceBadgeExample() {
  return (
    <div className="p-6 max-w-md">
      <PriceBadge 
        priceMin={80000}
        priceMax={200000}
        lastUpdated={new Date().toISOString()}
      />
    </div>
  );
}
