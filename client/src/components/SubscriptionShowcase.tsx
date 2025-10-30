import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, Check, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShowcaseSection {
  id: string;
  title: string;
  content: JSX.Element;
}

interface Props {
  doctorImage: string;
}

export default function SubscriptionShowcase({ doctorImage }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const sections: ShowcaseSection[] = useMemo(() => [
    {
      id: "doctor",
      title: "Meet Our Exotic Bird Specialist",
      content: (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={doctorImage}
              alt="Dr. B. Anand Rathore"
              className="w-full h-80 object-cover object-top rounded-lg"
              data-testid="showcase-doctor-image"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground mb-1" data-testid="showcase-doctor-name">
              Dr. B. Anand Rathore
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              Certified Exotic Bird Veterinarian — Reg. No: TGVC/02597
            </p>
            <p className="text-sm text-muted-foreground mb-3" data-testid="showcase-doctor-specialization">
              12+ years of focused experience in avian surgery, medicine, nutrition, and wildlife conservation
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Avian Surgery & Medicine
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Bird Nutritionist
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Behavioral Medicine
              </Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "plans",
      title: "Subscription Plans",
      content: (
        <div className="space-y-3">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">Monthly Plan</h4>
                <span className="text-xl font-bold text-primary">₹2,100/mo</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  2 consultations/month
                </Badge>
                <Badge className="text-xs bg-orange-600 hover:bg-orange-700">
                  <DollarSign className="h-3 w-3 mr-1" />
                  20% OFF
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">6-Month Plan</h4>
                <span className="text-xl font-bold text-primary">₹21,600</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  3 consultations/month
                </Badge>
                <Badge className="text-xs bg-primary hover:bg-primary/90">
                  <DollarSign className="h-3 w-3 mr-1" />
                  25% OFF
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-green-500/50 bg-green-50/50 dark:bg-green-950/20 overflow-visible">
            <div className="absolute -top-2 -right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              Best Value
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">Annual Plan</h4>
                <span className="text-xl font-bold text-green-600">₹37,400/yr</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-green-600 text-green-600">
                  <Calendar className="h-3 w-3 mr-1" />
                  4 consultations/month
                </Badge>
                <Badge className="text-xs bg-green-600 hover:bg-green-700">
                  <DollarSign className="h-3 w-3 mr-1" />
                  35% OFF
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "coverage",
      title: "What You'll Receive",
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Deworming & Preventive Care
              </h4>
              <p className="text-xs text-muted-foreground">
                Regular protocols to keep your bird healthy
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Personalized Diet Plans
              </h4>
              <p className="text-xs text-muted-foreground">
                Tailored nutrition for your bird's species and age
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Supplements Guidance
              </h4>
              <p className="text-xs text-muted-foreground">
                Expert advice on vitamins and minerals
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                Behavior Training
              </h4>
              <p className="text-xs text-muted-foreground">
                Tips and enrichment activities for happy birds
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                24/7 WhatsApp Support
              </h4>
              <p className="text-xs text-muted-foreground">
                Urgent concerns answered anytime
              </p>
            </div>
          </div>
        </div>
      )
    }
  ], [doctorImage]);

  const currentSection = sections[currentIndex];

  useEffect(() => {
    if (isPaused || isHovered || hasFocus) return;
    if (sections.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sections.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, isHovered, hasFocus, sections.length]);

  return (
    <Card
      className="relative overflow-hidden max-w-md w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHasFocus(false);
        }
      }}
      data-testid="subscription-showcase"
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground" data-testid="showcase-section-title">
            {currentSection.title}
          </h3>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            data-testid="subscription-showcase-pause-button"
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div data-testid={`showcase-section-${currentSection.id}`}>
          {currentSection.content}
        </div>

        <div
          className="flex justify-center gap-2 mt-6"
          role="tablist"
          aria-label="Section selection"
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30"
              }`}
              aria-label={`Select ${section.title}`}
              aria-current={index === currentIndex ? "true" : undefined}
              role="tab"
              data-testid={`subscription-section-indicator-${index}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
