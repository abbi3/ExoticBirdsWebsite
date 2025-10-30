import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface MetricCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  subtext: string;
  isAnimating?: boolean;
}

function MetricCard({ icon, value, label, subtext, isAnimating }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate count-up on mount and when value changes
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 30;
    const increment = (value - displayValue) / steps;
    const stepDuration = duration / steps;

    if (Math.abs(value - displayValue) < 0.1) {
      setDisplayValue(value);
      return;
    }

    const timer = setInterval(() => {
      setDisplayValue((prev) => {
        const next = prev + increment;
        if ((increment > 0 && next >= value) || (increment < 0 && next <= value)) {
          clearInterval(timer);
          return value;
        }
        return next;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, displayValue]);

  return (
    <Card 
      className={`
        hover-elevate 
        transition-all 
        duration-300 
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      data-testid={`metric-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            {icon}
          </div>
          <div className="flex-1">
            <div 
              className="text-3xl font-bold text-primary mb-1"
              data-testid={`metric-value-${label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {Math.round(displayValue)}
            </div>
            <div className="text-sm font-medium text-foreground mb-1">{label}</div>
            <div className="text-xs text-muted-foreground">{subtext}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SocialProofWidget() {
  const [isUpdating, setIsUpdating] = useState(false);

  // Poll active users every 60 seconds
  const { data: activeUsersData } = useQuery<{ value: number; expires_in_seconds: number }>({
    queryKey: ["/api/metrics/active-users"],
    refetchInterval: 60000, // 60 seconds
  });

  // Poll active subscriptions every 30 seconds
  const { data: activeSubscriptionsData, refetch: refetchSubscriptions } = useQuery<{ 
    value: number; 
    last_updated: string 
  }>({
    queryKey: ["/api/metrics/active-subscriptions"],
    refetchInterval: 30000, // 30 seconds
  });

  // Trigger animation when subscriptions value changes
  useEffect(() => {
    if (activeSubscriptionsData) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [activeSubscriptionsData?.value]);

  // Expose refetch function globally for payment success integration
  useEffect(() => {
    (window as any).refetchActiveSubscriptions = refetchSubscriptions;
  }, [refetchSubscriptions]);

  const activeUsers = activeUsersData?.value ?? 12;
  const activeSubscriptions = activeSubscriptionsData?.value ?? 100;

  return (
    <div className="mb-8" data-testid="social-proof-widget">
      <div className="text-center mb-4">
        <h3 className="text-xl font-semibold text-foreground">
          Join the Fancy Feathers community
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          icon={<Users className="w-6 h-6 text-primary" />}
          value={activeUsers}
          label="Active users right now"
          subtext="Approximate numbers updated in real-time"
        />
        
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-primary" />}
          value={activeSubscriptions}
          label="Active subscriptions"
          subtext="Growing every day — join now"
          isAnimating={isUpdating}
        />
      </div>
    </div>
  );
}
