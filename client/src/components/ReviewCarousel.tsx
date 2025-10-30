import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewsData, type Review } from "@/lib/reviewsData";

export default function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    if (isPaused || isHovered || hasFocus) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
    }, 5000); // Change review every 5 seconds

    return () => {
      clearInterval(interval);
    };
  }, [isPaused, isHovered, hasFocus, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviewsData.length);
  };

  const currentReview = reviewsData[currentIndex];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <CardContent className="p-6 md:p-8">
        <div className="min-h-[200px] flex flex-col justify-between">
          {/* Review Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground" data-testid={`review-name-${currentReview.id}`}>
                  {currentReview.name}
                </h3>
                <div className="mt-1" data-testid={`review-rating-${currentReview.id}`}>
                  {renderStars(currentReview.rating)}
                </div>
              </div>

              {/* Navigation Arrows - Desktop */}
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={goToPrevious}
                  aria-label="Previous review"
                  data-testid="button-review-prev"
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={goToNext}
                  aria-label="Next review"
                  data-testid="button-review-next"
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed" data-testid={`review-text-${currentReview.id}`}>
              "{currentReview.review}"
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            {/* Progress Indicators */}
            <div className="flex gap-1.5">
              {reviewsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : undefined}
                  role="tab"
                  data-testid={`review-indicator-${index}`}
                />
              ))}
            </div>

            {/* Play/Pause Button */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Resume auto-play" : "Pause auto-play"}
              data-testid="button-review-toggle-play"
              className="h-8 w-8"
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation Arrows */}
          <div className="flex sm:hidden items-center justify-center gap-4 mt-4">
            <Button
              size="icon"
              variant="outline"
              onClick={goToPrevious}
              aria-label="Previous review"
              data-testid="button-review-prev-mobile"
              className="h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {reviewsData.length}
            </span>
            <Button
              size="icon"
              variant="outline"
              onClick={goToNext}
              aria-label="Next review"
              data-testid="button-review-next-mobile"
              className="h-10 w-10"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
