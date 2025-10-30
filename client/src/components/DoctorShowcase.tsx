import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionPlan {
  name: string;
  price: string;
  consultations: string;
  savings?: string;
}

interface DoctorInfo {
  name: string;
  image: string;
  credentials: string[];
  specialization: string;
}

interface Props {
  doctor: DoctorInfo;
  subscriptionPlans: SubscriptionPlan[];
}

export default function DoctorShowcase({ doctor, subscriptionPlans }: Props) {
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentPlan = subscriptionPlans[currentPlanIndex];

  useEffect(() => {
    if (isPaused || isHovered || subscriptionPlans.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPlanIndex((prev) => (prev + 1) % subscriptionPlans.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, isHovered, subscriptionPlans.length]);

  return (
    <Card
      className="relative overflow-hidden max-w-md w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      data-testid="doctor-showcase"
    >
      <div className="relative">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-64 object-cover"
          data-testid="doctor-image"
        />
        
        {subscriptionPlans.length > 1 && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-4 right-4 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            data-testid="showcase-pause-button"
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-2" data-testid="doctor-name">
          {doctor.name}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-3" data-testid="doctor-specialization">
          {doctor.specialization}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {doctor.credentials.map((credential, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs"
              data-testid={`credential-${idx}`}
            >
              {credential}
            </Badge>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex items-baseline justify-between mb-2">
            <h4 className="text-lg font-semibold text-foreground" data-testid="plan-name">
              {currentPlan.name}
            </h4>
            <span className="text-2xl font-bold text-primary" data-testid="plan-price">
              {currentPlan.price}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs" data-testid="plan-consultations">
              {currentPlan.consultations}
            </Badge>
            {currentPlan.savings && (
              <Badge className="text-xs bg-green-600 hover:bg-green-700" data-testid="plan-savings">
                {currentPlan.savings}
              </Badge>
            )}
          </div>

          {subscriptionPlans.length > 1 && (
            <div
              className="flex justify-center gap-2 mt-4"
              role="tablist"
              aria-label="Subscription plan selection"
            >
              {subscriptionPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPlanIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentPlanIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`Select ${subscriptionPlans[index].name}`}
                  aria-current={index === currentPlanIndex ? "true" : undefined}
                  role="tab"
                  data-testid={`plan-indicator-${index}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
