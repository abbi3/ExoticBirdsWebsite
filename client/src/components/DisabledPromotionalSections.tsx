/**
 * DISABLED PROMOTIONAL SECTIONS
 * 
 * This file contains promotional sections that have been temporarily disabled from the homepage.
 * They can be re-enabled by copying the desired section back to client/src/pages/Home.tsx
 * 
 * Sections included:
 * 1. Toys That Bring Joy (Bird Toys & Accessories)
 * 2. Comfort & Care (Bird Cages)
 * 3. Nutrition That Nurtures (Bird Food)
 * 
 * To re-enable: Copy the section code and paste it in Home.tsx between the 
 * "Discover the Vibrant World" section and the bird catalog section.
 */

// SECTION 1: BIRD TOYS & ACCESSORIES
// Copy this entire section block to re-enable
/*
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Toys That Bring Joy — Safe, Smart & Handcrafted for Your Feathered Family
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Bird toys aren't just playthings — they're essential for your bird's happiness, health, and mental growth. Every toy must be safe, non-toxic, and free from harmful plastics or swallowable parts. The right toy keeps your bird active, curious, and emotionally balanced, while also showing how much you care.
                    <br /><br />
                    At Fancy Feathers, each toy is handcrafted with love and tested with care, designed to provide mental stimulation, physical exercise, and pure joy — for your bird and for you. Because a happy bird makes a happy home. 🪶💛
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    onClick={() => {
                      // Placeholder - toys catalog will be added later
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-testid="button-explore-toys"
                  >
                    Explore Toys and Accessories
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
*/

// SECTION 2: BIRD CAGES
// Copy this entire section block to re-enable
/*
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <HomeIcon className="h-6 w-6 text-primary" />
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Comfort & Care — Thoughtfully Designed Bird Cages for Rest and Safety
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    At Fancy Feathers, we believe birds are meant to fly free and explore, not stay confined. However, a well-designed cage plays an important role as a safe feeding station and peaceful resting space, especially during the night or when supervision isn't possible.
                    <br /><br />
                    Our collection of cages is ergonomically crafted to provide comfort, freedom of movement, and easy navigation for your feathered friend — ideal for short resting periods. Each cage is easy to clean, durable, and built from premium-quality materials, carefully selected from the best global manufacturers.
                    <br /><br />
                    Because even when your bird is resting, it deserves comfort, safety, and care — just like home. 🪶💛
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    onClick={() => {
                      // Placeholder - cages catalog will be added later
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-testid="button-explore-cages"
                  >
                    Explore Cage and resting station
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
*/

// SECTION 3: BIRD FOOD & NUTRITION
// Copy this entire section block to re-enable
/*
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Apple className="h-6 w-6 text-primary" />
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    Nutrition That Nurtures — Premium Bird Food for Every Species & Stage
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    Balanced nutrition is the foundation of a healthy, happy bird. While fresh fruits and vegetables are essential, they often lack the complete vitamins, minerals, and supplements that birds need for long-term well-being. Every bird — depending on its species, age, and activity level — requires a unique diet plan to thrive.
                    <br /><br />
                    At Fancy Feathers, we've handpicked premium bird foods from the world's finest manufacturers, imported from the USA, Canada, and Germany, ensuring the highest standards of quality and safety. Each blend is carefully chosen to support your bird's immune health, feather growth, and vitality.
                    <br /><br />
                    When you receive your personalized diet chart, we also recommend the most suitable food brands and mixes tailored to your bird's needs — because good nutrition is not just feeding, it's nurturing. 🌿💛
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover-elevate active-elevate-2"
                    onClick={() => {
                      // Placeholder - bird food catalog will be added later
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    data-testid="button-bird-food"
                  >
                    Bird Food and Diet
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
*/

// REQUIRED IMPORTS FOR THESE SECTIONS:
// Make sure these icons are imported in Home.tsx when re-enabling:
// import { Sparkles, Home as HomeIcon, Apple } from "lucide-react";

export {};
