import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Calendar, DollarSign, ArrowRight, HeartPulse } from "lucide-react";
import { Link } from "wouter";

export default function SubscriptionPrompt() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2" data-testid="prompt-heading">
                Unlock Expert Bird Care Today!
              </h3>
              <p className="text-muted-foreground text-sm">
                Get personalized consultations with Dr. B. Anand Rathore, an experienced exotic bird specialist. 
                Save up to 35% with our subscription plans!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Monthly Plan */}
            <Card className="border-2 hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid="card-monthly-plan">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="mb-2">
                    Monthly
                  </Badge>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-primary">₹2,100</p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>2 consultations/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-orange-600 hover:bg-orange-700">
                        <DollarSign className="h-3 w-3 mr-1" />
                        20% OFF
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6-Month Plan */}
            <Card className="border-2 hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid="card-six-month-plan">
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="mb-2">
                    6 Months
                  </Badge>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-primary">₹21,600</p>
                    <p className="text-xs text-muted-foreground">₹3,600/month</p>
                  </div>
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>3 consultations/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-primary hover:bg-primary/90">
                        <DollarSign className="h-3 w-3 mr-1" />
                        25% OFF
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Annual Plan - Best Value */}
            <Card className="border-2 border-green-500/50 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20 hover-elevate active-elevate-2 cursor-pointer transition-all relative" data-testid="card-annual-plan">
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                Best Value
              </div>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <Badge variant="outline" className="mb-2 border-green-600 text-green-600">
                    Annual
                  </Badge>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-green-600">₹37,400</p>
                    <p className="text-xs text-muted-foreground">₹3,117/month</p>
                  </div>
                  <div className="pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span>4 consultations/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-green-600 hover:bg-green-700">
                        <DollarSign className="h-3 w-3 mr-1" />
                        35% OFF
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 rounded-lg bg-muted/30 space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse className="h-5 w-5 text-primary" />
              <h4 className="font-semibold">What's Included:</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Deworming & preventive care</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Personalized diet plans</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Supplements guidance</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Behavior training tips</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>24/7 WhatsApp support</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Expert consultation calls</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link href="/subscription" className="flex-1">
              <Button size="lg" className="w-full" data-testid="button-subscribe-now">
                Subscribe Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" data-testid="button-learn-more">
                Learn More
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Join hundreds of bird owners who trust Dr. Anand Rathore for expert care
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
