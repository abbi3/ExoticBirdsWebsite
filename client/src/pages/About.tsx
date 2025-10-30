import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Heart, Info, Phone, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import aliImage from '@assets/og-image.jpg_1761292200700.jpeg';

export default function About() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">About Fancy Feathers India</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Card 
              className="p-8 mb-8 cursor-pointer hover-elevate active-elevate-2 transition-all"
              onClick={() => setIsDialogOpen(true)}
              data-testid="card-founder"
            >
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex-shrink-0">
                  <img 
                    src={aliImage} 
                    alt="Ali - Founder of Fancy Feathers India" 
                    className="w-48 h-48 rounded-lg object-cover border-4 border-primary/20"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                    <User className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold">Meet the Founder - Ali</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    With 12+ years of dedicated experience in exotic bird care, training, and welfare, 
                    Ali has built Fancy Feathers India on a foundation of love, empathy, and deep understanding 
                    of these magnificent creatures.
                  </p>
                  <Button variant="outline" size="sm" data-testid="button-read-more">
                    Click to Read Ali's Full Story
                  </Button>
                </div>
              </div>
            </Card>

            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  About Me – Ali from Fancy Feathers India
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <div className="flex justify-center mb-4">
                  <img 
                    src={aliImage} 
                    alt="Ali - Founder" 
                    className="w-64 h-64 rounded-lg object-cover border-4 border-primary/20"
                  />
                </div>
                
                <p>
                  My name is <strong className="text-foreground">Ali</strong>, and for the past <strong className="text-foreground">12+ years</strong>, 
                  I have been managing Fancy Feathers India — a heartfelt initiative born out of love, care, and deep respect for exotic birds.
                </p>

                <p>
                  I was born and raised in a family surrounded by exotic birds, and my journey with them started long before I even realized 
                  it was my calling. From a young age, I learned how to raise, groom, and train birds with empathy and understanding — 
                  not just as pets, but as companions with emotions, intelligence, and a voice of their own.
                </p>

                <p>
                  Over the years, I have pursued professional training in bird behavior from renowned experts outside India, and continue 
                  to expand my knowledge by reading and studying avian psychology and care. But beyond education, it's the everyday bond 
                  with these magnificent creatures that has shaped who I am today.
                </p>

                <div className="bg-primary/10 p-4 rounded-lg border-l-4 border-l-primary">
                  <p className="font-semibold text-foreground mb-2">My mission is simple yet profound —</p>
                  <p className="text-primary font-medium">👉 To ensure every bird lives a happy, healthy, and cage-free life.</p>
                </div>

                <p>
                  At Fancy Feathers, my goal is to spread awareness, educate bird owners, and build a community that truly understands 
                  what it means to care for exotic birds responsibly. I believe that birds should not be confined to cages; they deserve 
                  space to fly, socialize, and express themselves freely.
                </p>

                <p>
                  Whether you're a bird parent seeking guidance on care, nutrition, or behavior training — or someone who wishes to bring 
                  home an exotic bird from a trusted, ethical, and healthy bloodline — I'm here to help.
                </p>

                <Card className="p-4 bg-card border-2 border-primary/30">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground text-lg">Get in Touch</h3>
                  </div>
                  <p className="mb-2">
                    You can reach me directly at{" "}
                    <a 
                      href="tel:+919014284059" 
                      className="text-primary font-semibold hover:underline"
                      data-testid="link-phone"
                    >
                      📞 +91 90142 84059
                    </a>
                  </p>
                  <p className="text-sm">
                    For any bird-related advice, guidance, or if you'd simply like to learn more about which bird suits you and 
                    your family — from talking birds, to vibrant colorful companions, to majestic free-flyers that soar hundreds 
                    of meters in the open sky.
                  </p>
                </Card>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-semibold text-foreground mb-2">This is not just my profession — it's my purpose and social cause:</p>
                  <p className="italic">
                    To create a world where every bird is cared for, understood, and given the freedom it deserves.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Card className="p-8 mb-8">
            <div className="flex items-start gap-4 mb-4">
              <Heart className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Nurturing Exotic Birds with Love, Care, and a Cage-Free Lifestyle</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At Fancy Feathers India, we promote free flight, cage-free living, and expert care. 
                  From training and nutrition to companionship, we ensure these intelligent beings thrive 
                  as part of your family while guiding you in choosing the best quality birds and finding 
                  the right companion.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform offers detailed species profiles, behavioral insights, care guides, and 
                  pricing information to help you discover the vibrant world of exotic pet birds. 
                  From majestic Macaws to charming Cockatoos and talking Amazon Parrots—explore their 
                  behavior, approximate price ranges, and find the bird that truly fits your home and family.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Our Commitment to Bird Welfare</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    At Fancy Feathers India, we believe in promoting responsible bird ownership through 
                    education and guidance. We can introduce you to experienced breeders and trusted sellers 
                    who maintain strong parent stock, careful rearing, and good husbandry practices.
                  </p>
                  <p>
                    When choosing a bird companion, we encourage you to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Seek birds from proven parentage with health screening</li>
                    <li>Ensure proper socialization and welfare practices</li>
                    <li>Understand the lifelong commitment involved</li>
                    <li>Prepare for proper housing, nutrition, and enrichment</li>
                    <li>Connect with reputable breeders who focus on quality and care</li>
                  </ul>
                  <p className="mt-4">
                    We're here to help you make informed decisions and provide guidance every step of the way 
                    in your journey to welcoming a feathered friend into your family.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="mb-8">
            <AccordionItem value="item-1">
              <AccordionTrigger data-testid="accordion-cites">
                What is CITES and why is it important?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    <strong className="text-foreground">CITES (Convention on International Trade in Endangered Species of Wild Fauna and Flora)</strong> is 
                    an international agreement that ensures the trade of exotic animals and birds is done responsibly and ethically. 
                    It helps protect endangered species while allowing bird enthusiasts to legally own and care for captive-bred exotic birds.
                  </p>
                  <p className="text-primary font-medium">
                    All the birds we deal with are compliant with CITES regulations, so you can own them with complete peace of mind.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger data-testid="accordion-legal">
                Is it legal to own exotic birds in India?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    <strong className="text-foreground">Yes, absolutely!</strong> It is completely legal to own exotic birds in India, 
                    provided they are non-native species (not originally from India). These include beautiful and popular species like 
                    Macaws, Cockatoos, and African Greys.
                  </p>
                  <p>
                    The Indian government allows keeping and breeding of such birds as long as they are captive-bred and not taken from the wild.
                  </p>
                  <p className="text-primary font-medium">
                    Owning an exotic bird is a wonderful experience — and we ensure all our birds are ethically bred, healthy, 
                    and fully compliant with Indian and international guidelines.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger data-testid="accordion-pricing">
                How accurate is the pricing information?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    We strive to provide the most accurate and transparent pricing for all our exotic birds. Prices may vary 
                    slightly depending on factors like age, training level, color mutation, and breeder reputation — but we 
                    always make sure you get the best value for your investment.
                  </p>
                  <p>
                    Each bird comes from responsible breeders who prioritize quality, care, and ethical breeding practices.
                  </p>
                  <p className="text-primary font-medium">
                    You'll always know exactly what you're paying for — a healthy, well-socialized bird that becomes part of your family.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger data-testid="accordion-care">
                Are exotic birds suitable for first-time pet owners?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    <strong className="text-foreground">Yes, 100%!</strong> Many exotic birds are perfect for first-time owners — 
                    <strong className="text-primary"> but only if they are human-raised and have good bonding with humans, and their tameness level is extremely good.</strong>
                  </p>
                  <p>
                    They're intelligent, affectionate, and love to interact with humans when properly socialized from a young age.
                  </p>
                  <p>
                    When you get a bird from us, you'll receive complete pre-purchase and post-purchase guidance — from selecting 
                    the right species to understanding diet, behavior, training, and bonding. Our team ensures that you feel 
                    confident and well-prepared before bringing your feathered friend home.
                  </p>
                  <p className="text-primary font-medium">
                    Birds that are hand-raised and human-socialized from the start tend to be especially friendly, making them wonderful 
                    companions even for beginners.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger data-testid="accordion-source">
                How do I find a reputable breeder?
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Finding the right breeder is key to ensuring your bird is healthy, friendly, and ethically raised. 
                    Always look for breeders who hand-raise their chicks, maintain hygienic breeding environments, and 
                    provide proper nutrition and care.
                  </p>
                  <p className="text-primary font-medium">
                    We can help you connect directly with verified and reputed breeders who follow the best standards 
                    in exotic bird care and breeding.
                  </p>
                  <Card className="p-4 bg-primary/5 border-primary/20 mt-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <p>
                        <strong className="text-foreground">Contact us at </strong>
                        <a 
                          href="tel:+919014284059" 
                          className="text-primary font-semibold hover:underline"
                          data-testid="link-phone-faq"
                        >
                          +91 9014284059
                        </a>
                        <span className="text-foreground"> and we'll happily guide you to the right sources and breeders 
                        to help you bring home your perfect feathered companion.</span>
                      </p>
                    </div>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <Info className="h-8 w-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information provided on this website is for educational purposes only and should not 
                  be considered as professional veterinary, legal, or financial advice. While we strive to 
                  maintain accurate and up-to-date information, laws, regulations, and market prices can 
                  change. Always consult with qualified professionals including avian veterinarians, legal 
                  experts, and experienced bird breeders before making any decisions regarding exotic bird 
                  ownership.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
