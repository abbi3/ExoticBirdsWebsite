import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Loader2, Users, Mail, Phone, Calendar, CreditCard, Heart, Bird } from "lucide-react";
import type { User } from "@shared/schema";
import { Link } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  const { data, isLoading, error } = useQuery<{ subscribers: User[] }>({
    queryKey: ["/api/subscribers"],
    enabled: !!user?.isAdmin,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getPlanLabel = (plan: string | null) => {
    if (!plan) return "None";
    if (plan === "monthly") return "Monthly (₹2,100/month)";
    if (plan === "six-month") return "6-Month Plan (₹21,600)";
    if (plan === "annual") return "Annual Plan (₹37,400/year)";
    // Legacy support for old three-year plan
    if (plan === "three-year") return "Three Year (₹30,240 - Legacy)";
    return plan;
  };

  const getStatusVariant = (status: string | null) => {
    if (status === "active") return "default";
    if (status === "inactive") return "secondary";
    return "outline";
  };

  // Admin Dashboard
  if (user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2" data-testid="heading-admin-dashboard">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage and view all Bird Care subscription members
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-destructive">
                    Failed to load subscribers. Please try again.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Subscriber Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-3xl font-bold text-primary">{data?.subscribers.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Subscribers</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-3xl font-bold text-green-600">
                          {data?.subscribers.filter(s => s.subscriptionStatus === "active").length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">Active</p>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <p className="text-3xl font-bold text-gray-600">
                          {data?.subscribers.filter(s => !s.subscriptionPlan).length || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">No Plan</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">All Subscribers</h2>
                  {!data?.subscribers || data.subscribers.length === 0 ? (
                    <Card>
                      <CardContent className="py-12">
                        <div className="text-center text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">No subscribers yet</p>
                          <p className="text-sm">When users sign up for Bird Care subscriptions, they will appear here.</p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {data.subscribers.map((subscriber) => (
                        <Card key={subscriber.id} className="hover-elevate" data-testid={`card-subscriber-${subscriber.id}`}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-xl">{subscriber.fullName}</CardTitle>
                                <CardDescription className="mt-1">@{subscriber.username}</CardDescription>
                              </div>
                              <Badge variant={getStatusVariant(subscriber.subscriptionStatus)}>
                                {subscriber.subscriptionStatus || "N/A"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{subscriber.email}</span>
                              </div>
                              {subscriber.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{subscriber.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span>{getPlanLabel(subscriber.subscriptionPlan)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Joined {new Date(subscriber.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Regular User Dashboard
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" data-testid="heading-user-dashboard">
              Welcome, {user.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Your Bird Care Dashboard
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Username</p>
                    <p className="font-medium">@{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  {user.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">{user.phone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-2xl font-bold text-primary mt-1">
                        {getPlanLabel(user.subscriptionPlan)}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(user.subscriptionStatus)} className="text-sm">
                      {user.subscriptionStatus || "N/A"}
                    </Badge>
                  </div>

                  {!user.subscriptionPlan && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-4">
                        You don't have an active subscription yet. Subscribe now to give your feathered friend the best care!
                      </p>
                      <Link href="/subscription">
                        <Button data-testid="button-subscribe-now">
                          <Heart className="h-4 w-4 mr-2" />
                          Subscribe to Bird Care
                        </Button>
                      </Link>
                    </div>
                  )}

                  {user.subscriptionPlan && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Thank you for being a valued member! Our team will contact you for your bird's health consultations.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bird className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-browse-birds">
                    <Bird className="h-4 w-4 mr-2" />
                    Browse Exotic Birds
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-about">
                    Learn About Our Services
                  </Button>
                </Link>
                {!user.subscriptionPlan && (
                  <Link href="/subscription">
                    <Button variant="default" className="w-full justify-start" data-testid="button-subscription-page">
                      <Heart className="h-4 w-4 mr-2" />
                      View Subscription Plans
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
