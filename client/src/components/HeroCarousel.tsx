import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Stethoscope, HandHeart, Bird } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage1 from '@assets/generated_images/Indian_family_four_members_birds_scene1_ea5596b5.png';
import heroImage2 from '@assets/generated_images/Indian_family_four_members_birds_scene2_445a2e56.png';
import heroImage3 from '@assets/generated_images/Indian_family_four_members_birds_scene3_bdaace07.png';
import heroImage4 from '@assets/generated_images/Family_garden_with_boy_playing_Scarlet_Macaw_8f245078.png';

const slides = [
  {
    image: heroImage1,
    title: "Happiness comes with feathers!",
    description: "Bring home a companion that talks, laughs, and becomes part of your family — because love comes in every color."
  },
  {
    image: heroImage2,
    title: "A family that chirps together, stays together!",
    description: "Exotic birds fill your home with laughter, colors, and unforgettable memories. Discover the joy of bonding beyond words."
  },
  {
    image: heroImage3,
    title: "More than a pet — it's a lifetime of friendship.",
    description: "Experience pure affection, endless conversations, and a splash of color in every moment with your exotic bird."
  },
  {
    image: heroImage4,
    title: "Where laughter takes flight and memories are made.",
    description: "Watch your children discover the magic of friendship with wings — creating moments of pure joy that bring the whole family together."
  },
  {
    image: heroImage2,
    title: "Add wings to your family's happiness.",
    description: "Give your loved ones the gift of joy, intelligence, and companionship — an exotic bird that becomes one of your own."
  }
];

interface HeroCarouselProps {
  onWhereToBuyClick: () => void;
  onBirdCareClick: () => void;
}

export default function HeroCarousel({ onWhereToBuyClick, onBirdCareClick }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-full">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/60" />
          </div>
          
          {/* Caption */}
          <div className="absolute bottom-8 md:bottom-16 left-0 right-0 z-10 px-3 sm:px-6 lg:px-8 pointer-events-none">
            <div className="container mx-auto max-w-4xl">
              <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 sm:p-6 md:p-8 border border-white/20">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                  {slide.title}
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed mb-4 sm:mb-6">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 pointer-events-auto">
                  <Button
                    size="default"
                    variant="outline"
                    className="bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20 hover-elevate active-elevate-2 text-xs sm:text-sm md:text-base"
                    onClick={() => {
                      window.scrollTo({
                        top: window.innerHeight * 0.7,
                        behavior: "smooth",
                      });
                    }}
                    data-testid="button-browse-birds"
                  >
                    <div className="flex items-center gap-1 mr-1 sm:mr-2">
                      <Bird className="h-3 w-3 sm:h-4 sm:w-4" />
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <span className="hidden sm:inline">Browse all Birds</span>
                    <span className="sm:hidden">Browse</span>
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20 hover-elevate active-elevate-2 text-xs sm:text-sm md:text-base"
                    onClick={onWhereToBuyClick}
                    data-testid="button-where-to-buy"
                  >
                    <ShoppingBag className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Where to Buy</span>
                    <span className="sm:hidden">Buy</span>
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="bg-background/10 backdrop-blur-sm border-white/30 text-white hover:bg-background/20 hover-elevate active-elevate-2 text-xs sm:text-sm md:text-base"
                    onClick={onBirdCareClick}
                    data-testid="button-bird-care"
                  >
                    <div className="flex items-center gap-1 mr-1 sm:mr-2">
                      <Stethoscope className="h-3 w-3 sm:h-4 sm:w-4" />
                      <HandHeart className="h-3 w-3 sm:h-4 sm:w-4" />
                    </div>
                    <span className="hidden sm:inline">Bird Care Subscription</span>
                    <span className="sm:hidden">Subscription</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all hover-elevate active-elevate-2"
        aria-label="Previous image"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition-all hover-elevate active-elevate-2"
        aria-label="Next image"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-white w-6 sm:w-8"
                : "bg-white/50 hover:bg-white/75 w-1.5 sm:w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
