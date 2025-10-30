import { Link, useLocation } from "wouter";
import { User, LogOut, Menu, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AnimatedLogo from "@/components/AnimatedLogo";

interface HeaderProps {
  onBrowseBirdsClick?: () => void; // existing optional prop
  onSearch?: (query: any) => void; 
  searchQuery?: string; 
}

export default function Header({ onBrowseBirdsClick,onSearch,searchQuery }: HeaderProps = {}) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whereToBuyOpen, setWhereToBuyOpen] = useState(false);

  // Check for user account session
  const { data: userAccountSession } = useQuery<any>({
    queryKey: ["/api/user-account/session"],
  });

  // Determine which user is logged in (admin or user account)
  const loggedInUser = user || userAccountSession?.account;
  const isUserAccount = !!userAccountSession?.account;

  const handleLogout = async () => {
    try {
      if (isUserAccount) {
        // Logout user account
        await apiRequest('POST', '/api/user-account/logout');
      } else {
        // Logout admin
        await logout();
      }
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      setLocation("/");
      setMobileMenuOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const NavLinks = ({ mobile = false }) => {
    const linkClass = mobile 
      ? "flex items-center gap-3 px-4 py-3 rounded-md hover-elevate active-elevate-2 transition-colors text-base font-medium"
      : "text-sm font-medium transition-colors hover:text-primary cursor-pointer";
    
    const handleClick = () => {
      if (mobile) setMobileMenuOpen(false);
    };

    const handleWhereToBuyClick = () => {
      setWhereToBuyOpen(true);
      if (mobile) setMobileMenuOpen(false);
    };

    const handleBrowseBirdsClick = () => {
      if (onBrowseBirdsClick) {
        onBrowseBirdsClick();
      } else {
        setLocation("/");
      }
      if (mobile) setMobileMenuOpen(false);
    };

    return (
      <>
        <Link href="/" data-testid={mobile ? "link-mobile-nav-home" : "link-nav-home"}>
          <span 
            onClick={handleClick}
            className={mobile ? linkClass : `${linkClass} ${location === "/" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Home
          </span>
        </Link>
        <Link href="/about" data-testid={mobile ? "link-mobile-nav-about" : "link-nav-about"}>
          <span 
            onClick={handleClick}
            className={mobile ? linkClass : `${linkClass} ${location === "/about" ? "text-foreground" : "text-muted-foreground"}`}
          >
            About
          </span>
        </Link>
        <span 
          onClick={handleWhereToBuyClick}
          className={mobile ? linkClass : `${linkClass} text-muted-foreground`}
          data-testid={mobile ? "link-mobile-nav-where-to-buy" : "link-nav-where-to-buy"}
        >
          Where to Buy
        </span>
        <Link href="/subscription" data-testid={mobile ? "link-mobile-nav-subscription" : "link-nav-subscription"}>
          <span 
            onClick={handleClick}
            className={mobile ? linkClass : `${linkClass} ${location === "/subscription" ? "text-foreground" : "text-muted-foreground"}`}
          >
            Bird Care Subscription
          </span>
        </Link>
        <span 
          onClick={handleBrowseBirdsClick}
          className={mobile ? linkClass : `${linkClass} text-muted-foreground`}
          data-testid={mobile ? "link-mobile-nav-birds" : "link-nav-birds"}
        >
          Browse all Birds
        </span>
        {loggedInUser && (
          <Link href={isUserAccount ? "/user-dashboard" : "/dashboard"} data-testid={mobile ? "link-mobile-nav-dashboard" : "link-nav-dashboard"}>
            <span 
              onClick={handleClick}
              className={mobile ? linkClass : `${linkClass} ${(location === "/dashboard" || location === "/user-dashboard") ? "text-foreground" : "text-muted-foreground"}`}
            >
              Dashboard
            </span>
          </Link>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <AnimatedLogo className="h-5 w-5" />
                  <span className="text-base">Fancy Feathers India</span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8">
                <NavLinks mobile={true} />
              </nav>
              <div className="mt-8 pt-8 border-t">
                {loggedInUser ? (
                  <div className="space-y-4">
                    <div className="px-4 py-2 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">Logged in as</p>
                      <p className="text-sm font-medium">{loggedInUser.fullName}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                      data-testid="button-mobile-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" data-testid="link-mobile-login">
                    <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 cursor-pointer">
              <AnimatedLogo className="h-6 w-6 md:h-7 md:w-7" />
              <span className="font-semibold text-base md:text-lg hidden sm:inline">Fancy Feathers India</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <NavLinks mobile={false} />
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {loggedInUser ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden lg:inline">
                  {loggedInUser.fullName}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  data-testid="button-logout"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login" data-testid="link-header-login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Where to Buy Dialog */}
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
    </header>
  );
}
