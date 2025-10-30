import { useRoute, Link } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PriceBadge from "@/components/PriceBadge";
import QuickFacts from "@/components/QuickFacts";
import CareChecklist from "@/components/CareChecklist";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ChevronLeft, Download, CheckCircle } from "lucide-react";
import { birdsData } from "@/lib/birdsData";

export default function BirdProfile() {
  const [, params] = useRoute("/bird/:slug");
  const bird = birdsData.find((b) => b.slug === params?.slug);

  if (!bird) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Bird not found</h1>
            <Link href="/">
              <Button data-testid="button-back-home">Back to Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDownloadPDF = () => {
    console.log("Download PDF for", bird.name);
    alert("PDF download feature coming soon!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="relative h-96 overflow-hidden bg-muted">
        <img
          src={bird.image}
          alt={bird.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4 text-white hover:text-white hover-elevate" data-testid="button-back">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Birds
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2" data-testid="text-bird-name">
              {bird.name}
            </h1>
            {bird.scientificName && (
              <p className="text-lg text-white/90 italic">{bird.scientificName}</p>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-6 flex-wrap h-auto">
                  <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  <TabsTrigger value="behavior" data-testid="tab-behavior">Behavior</TabsTrigger>
                  <TabsTrigger value="diet" data-testid="tab-diet">Diet</TabsTrigger>
                  <TabsTrigger value="as-pet" data-testid="tab-as-pet">As a Pet</TabsTrigger>
                  <TabsTrigger value="documentation" data-testid="tab-documentation">Documentation</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">About {bird.name}</h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground leading-relaxed">{bird.behavior}</p>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Origin & Habitat</h3>
                    <p className="text-muted-foreground">{bird.origin}</p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Lifespan</h3>
                    <p className="text-muted-foreground">
                      With proper care, {bird.name.toLowerCase()}s can live {bird.lifespan}, making them 
                      a long-term companion that requires serious commitment.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Where to Buy</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      If you're looking for a healthy, well-bred {bird.name}, we can introduce you to experienced breeders and trusted sellers who maintain strong parent stock, careful rearing and good husbandry practices.
                    </p>
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        📞 For vetted contacts and current availability, message us on WhatsApp: <a href="https://wa.me/919014284059" className="text-primary font-semibold hover:underline" target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp">+91 90142 84059</a>
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="behavior" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Behavioral Characteristics</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{bird.behavior}</p>
                    
                    <h3 className="text-xl font-semibold mb-3 mt-6">Social Needs</h3>
                    <p className="text-muted-foreground leading-relaxed">{bird.humanCompatibility}</p>
                  </Card>
                </TabsContent>

                <TabsContent value="diet" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Dietary Requirements</h2>
                    <p className="text-muted-foreground leading-relaxed">{bird.diet}</p>

                    <div className="mt-6 p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Important:</strong> Always consult with an avian veterinarian to create 
                        a tailored diet plan for your bird based on their age, health, and activity level.
                      </p>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="as-pet" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">As a Companion</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">{bird.humanCompatibility}</p>
                    
                    <h3 className="text-xl font-semibold mb-4 mt-6">What Makes Them Special</h3>
                    <ul className="space-y-3">
                      {bird.prosAsPet.map((pro, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </TabsContent>

                <TabsContent value="documentation" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Essential Documentation</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      When purchasing a {bird.name}, proper documentation and health testing are crucial to ensure you're getting a healthy bird from a reputable source. Here's what you should request from the breeder or seller.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      DNA Testing with Bloodline
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      DNA testing verifies the bird's genetic sex and can trace its lineage. This is especially important for breeding purposes and understanding hereditary health conditions. A reputable breeder should provide:
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground ml-6">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        DNA sex certification from an accredited laboratory
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Bloodline documentation showing parent lineage and genetic history
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Information about any known genetic strengths or concerns in the lineage
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Health Check Reports</h3>
                    <p className="text-muted-foreground mb-6">
                      These tests screen for the most common and serious diseases affecting parrots. All birds should be tested and certified negative before purchase.
                    </p>

                    <div className="space-y-6">
                      <div className="border-l-4 border-l-primary pl-4">
                        <h4 className="font-semibold mb-2">PBFD (Psittacine Beak and Feather Disease)</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          PBFD is a highly contagious viral disease that affects the immune system, feathers, and beak of parrots. It causes feather loss, beak deformities, and weakened immunity, making birds vulnerable to other infections. This disease is incurable and often fatal. Birds must test negative before purchase, and retesting is recommended periodically. PBFD can be transmitted through feather dust, droppings, and direct contact.
                        </p>
                      </div>

                      <div className="border-l-4 border-l-primary pl-4">
                        <h4 className="font-semibold mb-2">APV (Avian Polyomavirus)</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Avian Polyomavirus is a serious viral infection that primarily affects young birds, though adult birds can be carriers. It causes symptoms including lethargy, loss of appetite, feather abnormalities, enlarged abdomen, and sudden death in young chicks. APV spreads through feather dust, droppings, and crop feeding. While there's no cure, vaccination is available for some species. Testing ensures your bird is not a carrier of this potentially deadly virus.
                        </p>
                      </div>

                      <div className="border-l-4 border-l-primary pl-4">
                        <h4 className="font-semibold mb-2">Chlamydia (Psittacosis / Parrot Fever)</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Chlamydia psittaci causes psittacosis (also called parrot fever or chlamydiosis), a bacterial infection that affects the respiratory system and can be transmitted to humans. Symptoms in birds include lethargy, eye discharge, nasal discharge, breathing difficulties, and lime-green droppings. In humans, it causes flu-like symptoms and can lead to serious respiratory complications if untreated. This disease is treatable with antibiotics, but prevention through testing is crucial for both bird and human health.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-primary/5 border-l-4 border-l-primary">
                    <h4 className="font-semibold mb-3">Important Reminder</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Always insist on seeing original health test results from certified avian veterinarians or accredited laboratories. Tests should be recent (within 30-60 days of purchase) and include the bird's identification details.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      For assistance finding breeders who provide complete documentation, contact us on WhatsApp: <a href="https://wa.me/919014284059" className="text-primary font-semibold hover:underline" target="_blank" rel="noopener noreferrer" data-testid="link-whatsapp-doc">+91 90142 84059</a>
                    </p>
                  </Card>
                </TabsContent>

              </Tabs>
            </div>

            <aside className="lg:w-80 flex-shrink-0 space-y-6">
              <QuickFacts
                scientificName={bird.scientificName}
                origin={bird.origin}
                lifespan={bird.lifespan}
                size={bird.size}
                noiseLevel={bird.noiseLevel}
              />

              <PriceBadge
                priceMin={bird.priceMin}
                priceMax={bird.priceMax}
                lastUpdated={bird.lastUpdated}
              />

              <CareChecklist items={bird.careChecklist} />

              <Button
                className="w-full"
                variant="outline"
                onClick={handleDownloadPDF}
                data-testid="button-download-pdf"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF Profile
              </Button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
