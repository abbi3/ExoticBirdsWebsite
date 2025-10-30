import BirdCard from '../BirdCard';
import blueGoldMacaw from '@assets/blue-gold-macaw.jpg_1761290156282.jpeg';

export default function BirdCardExample() {
  const mockBird = {
    id: "1",
    name: "Blue-and-Gold Macaw",
    scientificName: "Ara ararauna",
    slug: "blue-gold-macaw",
    image: blueGoldMacaw,
    size: "large" as const,
    noiseLevel: "loud" as const,
    traits: ["vibrant", "talking", "intelligent", "human-bonding"],
    lifespan: "50-60 years",
    origin: "South America",
    behavior: "Highly social, loud, intelligent; needs lots of interaction and toys.",
    diet: "Pellets, fruits (mango, papaya), nuts, occasional vegetables.",
    humanCompatibility: "Affectionate but demanding; good with experienced owners.",
    priceMin: 80000,
    priceMax: 200000,
    lastUpdated: new Date().toISOString(),
    prosAsPet: ["Highly intelligent", "Beautiful colors", "Can learn tricks"],
    consAsPet: ["Very loud", "Needs large space", "Expensive"],
    careChecklist: ["Daily feeding", "Social interaction", "Cage cleaning"],
    legalNotes: "CITES Appendix II - Legal with proper documentation"
  };

  return <BirdCard bird={mockBird} />;
}
