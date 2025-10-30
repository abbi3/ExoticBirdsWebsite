import { Bird } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube, SiWhatsapp } from "react-icons/si";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <Bird className="h-5 w-5 text-primary" />
              <span className="font-semibold text-base md:text-base">Fancy Feathers India</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Nurturing exotic birds with love, care, and a cage-free lifestyle. Your guide to finding the perfect feathered companion.
            </p>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border">
          <div className="flex flex-col items-center gap-4 mb-6">
            <h3 className="font-semibold text-sm md:text-base">Follow Us</h3>
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href="https://www.instagram.com/fancy_feathers_india/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Instagram"
                data-testid="link-instagram"
              >
                <SiInstagram className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="https://www.facebook.com/fancyfeathers.india"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Follow us on Facebook"
                data-testid="link-facebook"
              >
                <SiFacebook className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="https://www.youtube.com/@fancyfeathersindia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Subscribe to our YouTube channel"
                data-testid="link-youtube"
              >
                <SiYoutube className="h-5 w-5 md:h-6 md:w-6" />
              </a>
              <a
                href="https://wa.me/+919014284059"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Contact us on WhatsApp"
                data-testid="link-whatsapp-social"
              >
                <SiWhatsapp className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </div>
          </div>
          
          <div className="flex justify-center text-xs sm:text-sm mb-6">
            <Link href="/contact-us" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-contact">
              Contact Us
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 md:gap-4 text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Fancy Feathers India. All rights reserved.</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
