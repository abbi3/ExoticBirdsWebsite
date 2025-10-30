import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home, Mail, MessageCircle, Globe, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  useEffect(() => {
    document.title = "Contact Us – Fancy Feathers India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Get in touch with Fancy Feathers India for consultation services, subscription support, and exotic bird care advice."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">We're Happy to Help</CardTitle>
            <p className="text-muted-foreground text-sm">
              We're happy to help you with any questions about your subscription or services.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a 
                    href="mailto:ali@fancyfeathers.co.in" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid="link-email"
                  >
                    ali@fancyfeathers.co.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">WhatsApp</h3>
                  <a 
                    href="https://wa.me/919014284059" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-whatsapp"
                  >
                    +91 9014284059
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Website</h3>
                  <a 
                    href="https://fancyfeathers.co.in" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="link-website"
                  >
                    fancyfeathers.co.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground">Hyderabad, India</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-4 border-t">
              <Clock className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <p className="text-muted-foreground">Monday – Saturday, 10:00 AM – 7:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/terms-and-conditions" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
              Terms and Conditions
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/cancellation-refund" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-refund">
              Cancellation & Refund
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/shipping-policy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-shipping">
              Shipping Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/contact-us" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
              Contact Us
            </Link>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-4">
            © 2025 Fancy Feathers India. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
