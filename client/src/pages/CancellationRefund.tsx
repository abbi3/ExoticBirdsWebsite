import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancellationRefund() {
  useEffect(() => {
    document.title = "Cancellation & Refund Policy – Fancy Feathers India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Learn about Fancy Feathers India's cancellation and refund policy for our consultation-based bird care services."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Cancellation & Refund Policy</h1>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Our Refund & Cancellation Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              At Fancy Feathers India, we strive to provide the best possible service. However, since we deal in digital and consultation-based services, our refund and cancellation policy is as follows:
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Consultation Subscriptions</h3>
              <p className="text-muted-foreground">
                Once a subscription is activated and consultation slots are scheduled, payments are non-refundable.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Cancellations Before Activation</h3>
              <p className="text-muted-foreground">
                If you wish to cancel a subscription before your first consultation is scheduled, you may request a cancellation within 24 hours of payment.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Refund Approval</h3>
              <p className="text-muted-foreground">
                Approved refunds (if applicable) will be processed to the original payment method within 7-10 business days.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Contact for Support</h3>
              <p className="text-muted-foreground">
                For refund or cancellation requests, email us at{" "}
                <a href="mailto:support@fancyfeathers.co.in" className="text-primary hover:underline">
                  support@fancyfeathers.co.in
                </a>{" "}
                or WhatsApp us at{" "}
                <a href="https://wa.me/919014284059" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  +91 9014284059
                </a>.
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
