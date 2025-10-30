import { Card } from "@/components/ui/card";
import { Globe, Clock, Ruler, Volume2 } from "lucide-react";

interface QuickFactsProps {
  scientificName: string;
  origin: string;
  lifespan: string;
  size: string;
  noiseLevel: string;
}

export default function QuickFacts({ scientificName, origin, lifespan, size, noiseLevel }: QuickFactsProps) {
  const facts = [
    { icon: Globe, label: "Scientific Name", value: scientificName, italic: true },
    { icon: Globe, label: "Origin", value: origin },
    { icon: Clock, label: "Lifespan", value: lifespan },
    { icon: Ruler, label: "Size", value: size.charAt(0).toUpperCase() + size.slice(1) },
    { icon: Volume2, label: "Noise Level", value: noiseLevel.charAt(0).toUpperCase() + noiseLevel.slice(1) },
  ];

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Quick Facts</h3>
      <div className="space-y-3">
        {facts.map((fact, index) => (
          <div key={index} className="flex items-start gap-3" data-testid={`fact-${fact.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <fact.icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{fact.label}</p>
              <p className={`text-sm font-medium ${fact.italic ? 'italic' : ''}`}>
                {fact.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
