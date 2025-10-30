import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShippingPolicy() {
  useEffect(() => {
    document.title = "Shipping Policy – Fancy Feathers India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Fancy Feathers India offers digital consultation services only. Learn about our shipping policy for digital services."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Shipping Policy</h1>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Digital Services Only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              We do not ship or sell any physical products or live birds.
            </p>

            <p className="text-muted-foreground">
              All our offerings, including consultation and subscription services, are digital and accessible online. Therefore, no shipping or delivery applies to our services.
            </p>

            <p className="text-muted-foreground">
              If in the future any digital reports or certificates are shared, they will be delivered electronically via email or WhatsApp.
            </p>
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
