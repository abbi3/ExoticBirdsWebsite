import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriceBadgeProps {
  priceMin: number;
  priceMax: number;
  lastUpdated: string;
}

export default function PriceBadge({ priceMin, priceMax, lastUpdated }: PriceBadgeProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-primary" />
          Estimated Price in India
        </h3>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground transition-colors" data-testid="button-price-info">
              <Info className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">
              Prices vary based on location, breeder reputation, bird age, and training. 
              Always verify with licensed breeders and ensure legal compliance.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="text-3xl font-bold text-primary mb-3" data-testid="text-price-range">
        {formatPrice(priceMin)} - {formatPrice(priceMax)}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Updated: {formatDate(lastUpdated)}</span>
      </div>

      <div className="mt-4 p-3 bg-muted rounded-md">
        <p className="text-xs text-muted-foreground">
          This is an estimated price range. Actual prices may vary significantly based on various factors 
          including the bird's lineage, training, and local market conditions.
        </p>
      </div>
    </Card>
  );
}
