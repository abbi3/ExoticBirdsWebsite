import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BirdCard from "@/components/BirdCard";
import FilterChips, { type Filters } from "@/components/FilterChips";
import HeroCarousel from "@/components/HeroCarousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { ArrowRight, Heart, HandHeart, Stethoscope, ShoppingBag, MessageCircle, SlidersHorizontal, Bird, Calendar } from "lucide-react";
import { birdsData } from "@/lib/birdsData";
import BirdShowcase from "@/components/BirdShowcase";
import SubscriptionShowcase from "@/components/SubscriptionShowcase";
import doctorAnandImage from "@assets/ChatGPT Image Oct 24, 2025, 08_08_37 PM_1761316723629.png";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [whereToBuyOpen, setWhereToBuyOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    traits: [],
    priceRange: null,
    sizes: [],
  });

  // Check user account and subscription status
  const { data: userAccount } = useQuery<any>({
    queryKey: ["/api/user-account"],
    retry: false,
    staleTime: 0, // Always refetch to ensure latest status
  });

  const { data: subscriptionData, isLoading: isLoadingSubscription } = useQuery<any>({
    queryKey: ["/api/user-account/subscription"],
    enabled: !!userAccount?.account,
    retry: false,
    staleTime: 0, // Always refetch to ensure latest status
  });

  // Log for debugging
  console.log('[HOME] User Account:', userAccount);
  console.log('[HOME] Subscription Data:', subscriptionData);
  console.log('[HOME] Is Loading Subscription:', isLoadingSubscription);

  const hasActiveSubscription = userAccount?.account && subscriptionData?.subscription?.status === 'active';
  console.log('[HOME] Has Active Subscription:', hasActiveSubscription);

  const filteredBirds = useMemo(() => {
    return birdsData.filter((bird) => {
      const matchesSearch =
        searchQuery === "" ||
        bird.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bird.scientificName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTraits =
        filters.traits.length === 0 ||
        filters.traits.every(trait => bird.traits.includes(trait));

      const matchesSize =
        filters.sizes.length === 0 ||
        filters.sizes.includes(bird.size);

      const matchesPrice =
        !filters.priceRange ||
        (() => {
          const [min, max] = filters.priceRange.split("-").map(Number);
          return bird.priceMin <= max && bird.priceMax >= min;
        })();

      return matchesSearch && matchesTraits && matchesSize && matchesPrice;
    });
  }, [searchQuery, filters]);

  const handleBrowseBirdsClick = () => {
    setShowCatalog(true);
    setTimeout(() => {
      const catalogElement = document.getElementById('bird-catalog');
      if (catalogElement) {
        catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onBrowseBirdsClick={handleBrowseBirdsClick} />

      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[400px] sm:min-h-[500px] overflow-hidden">
        <HeroCarousel 
          onWhereToBuyClick={() => setWhereToBuyOpen(true)}
          onBirdCareClick={() => setLocation("/subscription")}
        />
      </section>

      <Dialog open={whereToBuyOpen} onOpenChange={setWhereToBuyOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-where-to-buy">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              Where to Buy Exotic Birds
            </DialogTitle>
            <DialogDescription className="text-base pt-4 space-y-4">
              <p className="text-foreground leading-relaxed">
                If you're looking for a healthy, well-bred Exotic Bird, we can introduce you to experienced breeders and trusted sellers who maintain strong parent stock, careful rearing and good husbandry practices.
              </p>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-3">
                  For vetted contacts and current availability, message us on WhatsApp:
                </p>
                <Button
                  size="lg"
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white hover-elevate active-elevate-2"
                  onClick={() => {
                    window.open('https://wa.me/919014284059', '_blank');
                  }}
                  data-testid="button-whatsapp-contact"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact on WhatsApp: +91 90142 84059
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left order-2 md:order-1">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Bird className="h-6 w-6 text-primary" />
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Discover the Vibrant World of Exotic Pet Birds
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mb-6">
                    From majestic Macaws to charming Cockatoos and talking Amazon Parrots—explore their 
                    behaviour, approximate price ranges, and find the bird that truly fits your home and family.
                  </p>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    onClick={() => {
                      setShowCatalog(true);
                      setTimeout(() => {
                        const catalogElement = document.getElementById('bird-catalog');
                        if (catalogElement) {
                          catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    data-testid="button-browse-species"
                  >
                    Browse all the species
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="w-full md:w-auto order-1 md:order-2">
                  <BirdShowcase birds={birdsData} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Show Appointment Booking for subscribed users, Subscription pitch for others */}
      {hasActiveSubscription ? (
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left order-2 md:order-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <Calendar className="h-6 w-6 text-primary" />
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Schedule a Consultation
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mb-6">
                      Book a consultation with our <span className="text-primary font-semibold">certified Exotic avian veterinarians</span>. 
                      Get expert health assessments, personalized care plans, and professional advice for your feathered companion.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        size="lg"
                        className="bg-primary text-primary-foreground hover-elevate active-elevate-2 min-h-11"
                        onClick={() => setLocation("/book-appointment")}
                        data-testid="button-book-consultation"
                      >
                        <Calendar className="mr-2 h-5 w-5" />
                        Book Appointment
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="hover-elevate active-elevate-2 min-h-11"
                        onClick={() => setLocation("/user-dashboard")}
                        data-testid="button-view-dashboard"
                      >
                        View My Dashboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="w-full md:w-auto order-1 md:order-2">
                    <SubscriptionShowcase doctorImage={doctorAnandImage} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      ) : (
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left order-2 md:order-1">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                      <Stethoscope className="h-6 w-6 text-primary" />
                      <HandHeart className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                      Comprehensive Bird Care Subscription
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mb-6">
                      Give your feathered companion expert care with monthly health check-ups, 
                      personalized nutrition plans, and guidance from <span className="text-primary font-semibold">certified Exotic avian veterinarians and certified Exotic Bird Behaviourist</span>.
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary text-primary-foreground hover-elevate active-elevate-2 min-h-11"
                      onClick={() => setLocation("/subscription")}
                      data-testid="button-bird-care-subscription"
                    >
                      View All Plans
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="w-full md:w-auto order-1 md:order-2">
                    <SubscriptionShowcase doctorImage={doctorAnandImage} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {(showCatalog || searchQuery) && (
        <main className="flex-1" id="bird-catalog">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Desktop Filter Sidebar - Hidden on Mobile */}
              <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                <div className="sticky top-24">
                  <Card className="p-6">
                    <FilterChips filters={filters} onFilterChange={setFilters} />
                  </Card>
                </div>
              </aside>

              <div className="flex-1">
                {/* Mobile Filter Button */}
                <div className="lg:hidden mb-4">
                  <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <DrawerTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full md:w-auto"
                        size="lg"
                        data-testid="button-mobile-filters"
                      >
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        Filters & Search
                        {(filters.traits.length > 0 || filters.priceRange || filters.sizes.length > 0) && (
                          <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            {filters.traits.length + filters.sizes.length + (filters.priceRange ? 1 : 0)}
                          </span>
                        )}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[85vh]">
                      <DrawerHeader>
                        <DrawerTitle>Filter Birds</DrawerTitle>
                      </DrawerHeader>
                      <div className="px-4 pb-8 overflow-y-auto">
                        <FilterChips filters={filters} onFilterChange={setFilters} />
                        <DrawerClose asChild>
                          <Button className="w-full mt-6" size="lg" data-testid="button-apply-filters">
                            Apply Filters
                          </Button>
                        </DrawerClose>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl md:text-2xl font-semibold mb-2">
                    {filteredBirds.length} {filteredBirds.length === 1 ? "Species" : "Species"} Found
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {searchQuery && `Showing results for "${searchQuery}"`}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredBirds.map((bird) => (
                    <BirdCard key={bird.id} bird={bird} />
                  ))}
                </div>

                {filteredBirds.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-4">
                      No birds found matching your criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setFilters({ traits: [], priceRange: null, sizes: [] });
                      }}
                      data-testid="button-clear-all"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
