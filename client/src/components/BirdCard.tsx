import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Bird } from "@shared/schema";

interface BirdCardProps {
  bird: Bird;
}

export default function BirdCard({ bird }: BirdCardProps) {
  const formatPrice = (min: number, max: number) => {
    return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k`;
  };

  const getTraitLabel = (trait: string) => {
    const labels: Record<string, string> = {
      "vibrant": "Vibrant",
      "free-flying": "Free Flying",
      "talking": "Talking",
      "intelligent": "Intelligent",
      "human-bonding": "Human Bonding"
    };
    return labels[trait] || trait;
  };

  return (
    <Link href={`/bird/${bird.slug}`} data-testid={`link-bird-${bird.slug}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={bird.image}
            alt={bird.name}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            data-testid={`img-bird-${bird.slug}`}
          />
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-3" data-testid={`text-bird-name-${bird.slug}`}>
            {bird.name}
          </h3>
          
          <div className="flex flex-wrap gap-2 mt-auto">
            {bird.traits.slice(0, 3).map((trait) => (
              <Badge key={trait} variant="outline" className="text-xs">
                {getTraitLabel(trait)}
              </Badge>
            ))}
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
              {formatPrice(bird.priceMin, bird.priceMax)}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
