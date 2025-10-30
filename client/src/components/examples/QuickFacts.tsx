import QuickFacts from '../QuickFacts';

export default function QuickFactsExample() {
  return (
    <div className="p-6 max-w-md">
      <QuickFacts 
        scientificName="Ara ararauna"
        origin="South America"
        lifespan="50-60 years"
        size="large"
        noiseLevel="loud"
      />
    </div>
  );
}
