import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "Privacy Policy – Fancy Feathers India";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Read Fancy Feathers India's Privacy Policy to understand how we collect, use, and protect your personal information."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <Link href="/">
            <Button variant="outline" size="sm" data-testid="button-home">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your Privacy Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Fancy Feathers India values your privacy. This Privacy Policy explains how we collect and use your personal data.
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
              <p className="text-muted-foreground">
                We collect your name, contact number, and pet details when you subscribe or request a consultation.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Use of Information</h3>
              <p className="text-muted-foreground">
                The information is used only for providing consultation services and managing your subscription.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Data Protection</h3>
              <p className="text-muted-foreground">
                Your data is stored securely and never sold or shared with third parties.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Third-Party Integrations</h3>
              <p className="text-muted-foreground">
                We use secure third-party payment gateways (e.g., Razorpay) to process payments. These providers may collect limited data as per their own privacy policies.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Your Rights</h3>
              <p className="text-muted-foreground">
                You can contact us anytime to update or delete your personal data.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <p className="text-muted-foreground">
                For privacy-related inquiries, reach out at{" "}
                <a href="mailto:support@fancyfeathers.co.in" className="text-primary hover:underline">
                  support@fancyfeathers.co.in
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
