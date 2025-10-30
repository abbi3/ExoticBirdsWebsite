import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsAndConditions() {
  useEffect(() => {
    document.title = "Terms and Conditions – Fancy Feathers India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Read the Terms and Conditions for Fancy Feathers India's subscription-based bird health and care consultation services."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Terms and Conditions</h1>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Welcome to Fancy Feathers India</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              By using our website and services, you agree to comply with the following Terms and Conditions.
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Nature of Service</h3>
              <p className="text-muted-foreground">
                Fancy Feathers India offers subscription-based bird health and care consultation services. We do not sell or trade live birds.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
              <p className="text-muted-foreground">
                All subscription plans are meant for virtual consultations, expert advice, and guidance on exotic bird care and wellbeing.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Payments</h3>
              <p className="text-muted-foreground">
                Payments for subscriptions and services are processed securely through our payment partners.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">User Responsibilities</h3>
              <p className="text-muted-foreground">
                Users are responsible for providing accurate information about their pets to help our experts offer the best advice.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
              <p className="text-muted-foreground">
                Fancy Feathers India does not replace physical veterinary treatment in emergencies. All advice is provided based on the details shared by the user.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Changes to Terms</h3>
              <p className="text-muted-foreground">
                We reserve the right to modify these terms at any time. Updated terms will be available on this page.
              </p>
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
