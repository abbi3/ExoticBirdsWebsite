import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Ruler, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Bird } from "@shared/schema";

interface BirdShowcaseProps {
  birds: Bird[];
}

export default function BirdShowcase({ birds }: BirdShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const currentBird = birds[currentIndex];

  useEffect(() => {
    if (isPaused || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % birds.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [birds.length, isPaused, isHovered]);

  if (!currentBird) return null;

  const formatPrice = (min: number, max: number) => {
    const formatNum = (num: number) => {
      if (num >= 100000) {
        return `${(num / 100000).toFixed(1)}L`;
      }
      return `${(num / 1000).toFixed(0)}K`;
    };
    return `₹${formatNum(min)}-${formatNum(max)}`;
  };

  const formatSize = (size: string) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  const formatTrait = (trait: string) => {
    return trait.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="relative w-full max-w-md mx-auto md:mx-0" data-testid="bird-showcase">
      <div 
        className="relative aspect-square rounded-lg overflow-hidden bg-muted"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
      >
        <img
          src={currentBird.image}
          alt={currentBird.name}
          className="w-full h-full object-cover transition-opacity duration-500"
          data-testid="showcase-bird-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 bg-white/90 hover:bg-white z-10"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
          data-testid="showcase-pause-button"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-3" data-testid="showcase-bird-name">
            {currentBird.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-foreground hover:bg-white/90 no-default-hover-elevate no-default-active-elevate"
              data-testid="showcase-trait"
            >
              {formatTrait(currentBird.traits[0])}
            </Badge>
            
            <span className="text-white/80">|</span>
            
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-foreground hover:bg-white/90 no-default-hover-elevate no-default-active-elevate flex items-center gap-1"
              data-testid="showcase-price"
            >
              <IndianRupee className="h-3 w-3" />
              {formatPrice(currentBird.priceMin, currentBird.priceMax)}
            </Badge>
            
            <span className="text-white/80">|</span>
            
            <Badge 
              variant="secondary" 
              className="bg-white/90 text-foreground hover:bg-white/90 no-default-hover-elevate no-default-active-elevate flex items-center gap-1"
              data-testid="showcase-size"
            >
              <Ruler className="h-3 w-3" />
              {formatSize(currentBird.size)}
            </Badge>
          </div>
          
          <div className="flex justify-center gap-1.5 mt-3" role="tablist" aria-label="Bird selection">
            {birds.map((_, index) => (
              <button
                key={index}
                role="tab"
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-6' 
                    : 'bg-white/50 w-1.5 hover:bg-white/70'
                }`}
                data-testid={`showcase-indicator-${index}`}
                aria-label={`View ${birds[index].name}`}
                aria-selected={index === currentIndex}
                aria-current={index === currentIndex ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
