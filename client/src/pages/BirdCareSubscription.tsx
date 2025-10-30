import { Check, Stethoscope, Award, Heart, CheckCircle2 } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionRequestData } from "@shared/schema";
import { birdsData } from "@/lib/birdsData";
import qrCode from '@assets/WhatsApp Image 2025-10-24 at 14.19.59_1761299053328.jpeg';
import doctorImage from '@assets/ChatGPT Image Oct 24, 2025, 08_08_37 PM_1761321114141.png';
import ReviewCarousel from "@/components/ReviewCarousel";
import SocialProofWidget from "@/components/SocialProofWidget";

export default function BirdCareSubscription() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Check if user is already logged in
  const { data: sessionData } = useQuery<any>({
    queryKey: ["/api/user-account/session"],
  });

  // Fetch subscription details if user is logged in
  const { data: subscriptionData } = useQuery<any>({
    queryKey: ["/api/user-account/subscription"],
    enabled: !!sessionData?.account,
  });
  const [step, setStep] = useState<'initial' | 'form' | 'payment'>('initial');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    birdSpecies: '',
    transactionId: ''
  });
  const [customSpecies, setCustomSpecies] = useState('');
  const [showDoctorProfile, setShowDoctorProfile] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    fullName: string;
    mobileNumber: string;
    transactionId: string;
    planType: string;
    subscriptionId: string;
  } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const subscriptionMutation = useMutation({
    mutationFn: async (data: SubscriptionRequestData) => {
      return await apiRequest('POST', '/api/subscription-requests', data);
    },
    onSuccess: (response: any) => {
      // Store success data before resetting form
      setSuccessData({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        transactionId: formData.transactionId,
        planType: selectedPlan || 'Monthly',
        subscriptionId: response.subscriptionRequest?.id || ''
      });
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Reset form and close modals
      setStep('initial');
      setShowPlanModal(false);
      setSelectedPlan(null);
      setFormData({
        fullName: '',
        mobileNumber: '',
        birdSpecies: '',
        transactionId: ''
      });
      setCustomSpecies('');
      setCouponCode('');
      setCouponDiscount(0);
      setCouponError('');
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleFormSubmit = async () => {
    // If user is logged in, skip validation and use their data
    if (sessionData?.account) {
      handleRazorpayPayment();
      return;
    }

    // Validate form for non-logged-in users
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name (at least 2 characters)",
        variant: "destructive",
      });
      return;
    }

    if (!formData.birdSpecies) {
      toast({
        title: "Validation Error",
        description: "Please select a bird species",
        variant: "destructive",
      });
      return;
    }

    // If "Other" is selected, validate custom species input
    if (formData.birdSpecies === 'Other' && !customSpecies.trim()) {
      toast({
        title: "Validation Error",
        description: "Please specify your bird species",
        variant: "destructive",
      });
      return;
    }

    // Open Razorpay payment
    handleRazorpayPayment();
  };

  const handleRazorpayPayment = async () => {
    try {
      // Show loading indicator
      toast({
        title: "Preparing Payment",
        description: "Please wait while we set up your payment...",
      });

      // Use logged-in user data if available, otherwise use form data
      const userName = sessionData?.account?.fullName || formData.fullName;
      const userPhone = sessionData?.account?.phone || formData.mobileNumber;
      const birdSpecies = sessionData?.account ? 'General' : (formData.birdSpecies === 'Other' ? customSpecies.trim() : formData.birdSpecies);

      // Create Razorpay order (amount is calculated server-side for security)
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionPlan: selectedPlan,
          discountCoupon: couponCode || null
        })
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        toast({
          title: "Payment Error",
          description: orderData.message || "Failed to create payment order",
          variant: "destructive",
        });
        return;
      }

      // Razorpay checkout options
      const options = {
        key: orderData.key_id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Fancy Feathers India',
        description: `${plans.find(p => p.id === selectedPlan)?.duration} Subscription`,
        order_id: orderData.order.id,
        prefill: {
          name: userName,
          contact: userPhone,
        },
        theme: {
          color: '#10b981', // Primary green color
          backdrop_color: 'rgba(0, 0, 0, 0.6)'
        },
        modal: {
          backdropclose: true, // Allow closing by clicking backdrop
          escape: true, // Allow closing with ESC key
          animation: true, // Enable smooth animations
          confirm_close: false, // Don't show confirmation when closing
          ondismiss: function() {
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
              variant: "default",
            });
          }
        },
        handler: async function (response: any) {
          // Payment successful - verify and create subscription
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                fullName: userName,
                mobileNumber: userPhone,
                birdSpecies: birdSpecies,
                subscriptionPlan: selectedPlan,
                discountCoupon: couponCode || null
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Store success data
              setSuccessData({
                fullName: userName,
                mobileNumber: userPhone,
                transactionId: response.razorpay_payment_id,
                planType: selectedPlan || 'Monthly',
                subscriptionId: verifyData.subscriptionRequest?.id || ''
              });

              // Invalidate queries to refresh subscription and session data
              queryClient.invalidateQueries({ queryKey: ['/api/user-account/subscription'] });
              queryClient.invalidateQueries({ queryKey: ['/api/user-account/session'] });
              
              // Refresh active subscriptions metric immediately
              queryClient.invalidateQueries({ queryKey: ['/api/metrics/active-subscriptions'] });

              // Show success dialog
              setShowSuccessDialog(true);

              // Reset form
              setStep('initial');
              setShowPlanModal(false);
              setSelectedPlan(null);
              setFormData({
                fullName: '',
                mobileNumber: '',
                birdSpecies: '',
                transactionId: ''
              });
              setCustomSpecies('');
              setCouponCode('');
              setCouponDiscount(0);
              setCouponError('');
            } else {
              toast({
                title: "Payment Verification Failed",
                description: verifyData.message || "Payment verification failed. Please contact support.",
                variant: "destructive",
              });
            }
          } catch (error: any) {
            toast({
              title: "Payment Verification Error",
              description: error.message || "An error occurred during payment verification",
              variant: "destructive",
            });
          }
        }
      };

      // Close the plan selection dialog BEFORE opening Razorpay to prevent overlay conflicts
      setShowPlanModal(false);

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive",
      });
    }
  };


  const benefits = [
    { text: "Monthly or quarterly health check-ups by ", highlight: "certified Exotic avian veterinarians" },
    { text: "Personalized diet and nutrition plans tailored to your bird's species, age, and health condition" },
    { text: "Guidance on supplements — when and how to give vitamins, calcium, or other essential additives" },
    { text: "Deworming and preventive care schedule, customized for your bird" },
    { text: "Behavior and training tips from ", highlight: "certified Exotic Bird Behaviourist", suffix: " to keep your bird mentally active and emotionally happy" },
    { text: "Regular health reminders for check-ups, vaccinations, and wellness milestones" },
    { text: "Exclusive access to avian health newsletters and care updates from our network of specialists" }
  ];

  const plans = [
    {
      id: "monthly",
      duration: "Monthly",
      originalPrice: "₹2,750",
      price: "₹2,200",
      priceNumeric: 2200,
      period: "per month",
      savings: "Save ₹550",
      discount: "20% OFF",
      consults: 2,
      consultsText: "2 consultations/month",
      limitedOffer: true,
      features: [
        "2 Expert Consultations",
        "Regular Bird Health & Care Guidance",
        "Exclusive Avian Vet Tips and Behavioral Updates"
      ]
    },
    {
      id: "six-month",
      duration: "6-Month Plan",
      originalPrice: "₹16,500",
      price: "₹12,375",
      priceNumeric: 12375,
      period: "for 6 months",
      savings: "Save ₹4,125",
      discount: "25% OFF",
      consults: 18,
      consultsText: "18 consultations total",
      popular: true,
      features: [
        "18 Expert Consultations",
        "Priority Scheduling for Health Reviews",
        "Nutrition & Enrichment Guidance for Birds"
      ]
    },
    {
      id: "annual",
      duration: "Annual Plan",
      originalPrice: "₹33,000",
      price: "₹23,100",
      priceNumeric: 23100,
      period: "per year",
      savings: "Save ₹9,900",
      discount: "30% OFF",
      consults: 48,
      consultsText: "48 consultations total",
      bestValue: true,
      features: [
        "48 Consultations",
        "Full-Year Health Tracking and Reports",
        "Seasonal Care Tips and Wellness Recommendations"
      ]
    }
  ];

  // Coupon validation
  const validCoupons: { [key: string]: number } = {
    'FFF796': 10,
    'FFF806': 20,
    'FFF816': 30,
    'FFF826': 40,
    'FFF836': 50,
    'FFF846': 60,
    'FFF856': 70,
    'FFF866': 80,
    'FFF876': 90,
    'FFF886': 100
  };

  const handleCouponApply = () => {
    const upperCoupon = couponCode.trim().toUpperCase();
    if (!upperCoupon) {
      setCouponError('');
      setCouponDiscount(0);
      return;
    }

    // Special test coupon
    if (upperCoupon === 'FFFTEST') {
      setCouponDiscount(-1); // Use -1 to indicate special Rs. 1 coupon
      setCouponError('');
    } else if (validCoupons[upperCoupon]) {
      setCouponDiscount(validCoupons[upperCoupon]);
      setCouponError('');
    } else {
      setCouponDiscount(0);
      setCouponError('Invalid discount coupon. Please enter a valid code.');
    }
  };

  const getDiscountedPrice = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return 0;
    
    // Special test coupon: Rs. 1 flat price
    if (couponDiscount === -1) {
      return 1;
    }
    
    const basePrice = plan.priceNumeric;
    const discountAmount = (basePrice * couponDiscount) / 100;
    return basePrice - discountAmount;
  };

  const formatPrice = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const birdSpeciesList = birdsData.map(bird => bird.name);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4" data-testid="heading-subscription">
                Comprehensive Bird Care Subscription
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                Give your feathered companion the care and attention it truly deserves. With our Bird Care Subscription, 
                you'll have access to regular consultations with <span className="text-primary font-semibold">certified Exotic avian veterinarians and certified Exotic Bird Behaviourist</span> who specialize in exotic 
                birds like Macaws, Cockatoos, Conures, and African Greys.
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>As a subscriber, you'll receive:</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">
                        {index === 0 && "🩺 "}
                        {index === 1 && "🥦 "}
                        {index === 2 && "💊 "}
                        {index === 3 && "🦠 "}
                        {index === 4 && "🕊️ "}
                        {index === 5 && "📆 "}
                        {index === 6 && "📩 "}
                        {benefit.text}
                        {benefit.highlight && (
                          <span className="text-primary font-semibold">{benefit.highlight}</span>
                        )}
                        {benefit.suffix}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-muted-foreground">
                  Your subscription ensures your bird stays healthy, active, and well-groomed — because caring for them 
                  should never be a guessing game.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-8 hover-elevate cursor-pointer" onClick={() => setShowDoctorProfile(true)} data-testid="card-specialist">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img 
                      src={doctorImage} 
                      alt="Dr. Anand Rathore - Exotic Bird Specialist"
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover object-top border-4 border-primary/20"
                      data-testid="img-doctor"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Meet Our Exotic Bird Specialist
                    </h3>
                    <p className="text-lg text-primary font-semibold mb-2">
                      Dr. Anand Rathore, DVM
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Certified Exotic Avian Veterinarian with 12+ years of specialized experience in exotic bird medicine, behavior, and nutrition
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary" className="gap-1">
                        <Award className="w-3 h-3" />
                        12+ Years Experience
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <Heart className="w-3 h-3" />
                        Certified Specialist
                      </Badge>
                    </div>
                  </div>
                  <div className="md:ml-auto">
                    <Button 
                      size="lg" 
                      data-testid="button-view-profile"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDoctorProfile(true);
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Dialog open={showDoctorProfile} onOpenChange={setShowDoctorProfile}>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Exotic Bird Specialist Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={doctorImage} 
                        alt="Dr. B. Anand Rathore - Exotic Bird Specialist"
                        className="w-48 h-64 rounded-lg object-cover object-top border-4 border-primary/20"
                      />
                      <div className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground rounded-full p-3">
                        <Stethoscope className="w-8 h-8" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">Dr. B. Anand Rathore</h3>
                      <p className="text-sm text-primary font-semibold mb-3">Certified Exotic Bird Veterinarian — Reg. No: TGVC/02597</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-muted-foreground leading-relaxed">
                        Dr. B. Anand Rathore is a highly respected exotic-avian veterinarian with 12+ years of focused experience 
                        in avian surgery, medicine, nutrition, and wildlife conservation. Trained in both clinical and field settings, 
                        Dr. Rathore combines advanced clinical skills with a compassionate, bird-centric approach to deliver 
                        comprehensive care for parrots, macaws, cockatoos, African greys, finches, waterfowl and other exotic species.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Areas of Clinical Expertise</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Avian Respiratory Care:</strong> Advanced diagnosis and treatment 
                            for respiratory infections and chronic airway disease.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Behavioral Medicine:</strong> Proven strategies to manage 
                            feather-plucking, aggression, separation anxiety and other behavior problems.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Orthopedics & Fracture Care:</strong> Stabilization, surgical 
                            repair and rehabilitation for fractures, sprains and mobility issues.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">PBFD Management:</strong> Specialized protocols for Psittacine 
                            Beak and Feather Disease — testing, supportive care and long-term management.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Crop & Digestive Disorders:</strong> Treatment for crop stasis, 
                            impaction and gastrointestinal disease.
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-foreground">Nutrition & Supplementation:</strong> Customized diet plans and 
                            deficiency correction to restore and maintain optimal health.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Professional Background & Training</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Dr. Rathore has served as an exotic veterinarian at India's largest exotic aviary in Daman and has 
                        collaborated with multiple NGOs on wildlife rescue, vulture and crocodile rehabilitation, and field 
                        conservation surveys. His formal qualifications include B.V.Sc & A.H and multiple postgraduate diplomas 
                        and specialty certifications in avian medicine, surgery, emergency care and conservation.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-3">Clinical Philosophy</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Dr. Rathore emphasizes preventive care, evidence-based medicine, and behavior-informed treatment plans. 
                        He blends clinical diagnostics, tailored nutrition, and behavioral training to treat the whole bird — 
                        not just symptoms — aiming for longer, healthier, happier lives for avian companions. His bedside manner 
                        is calm, precise and empathetic, making him a trusted partner for bird owners and avian institutions alike.
                      </p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground text-center mb-3">
                        Dr. Rathore is dedicated to providing the highest quality care for your exotic bird companion
                      </p>
                      <Button 
                        size="lg" 
                        className="w-full"
                        onClick={() => {
                          setShowDoctorProfile(false);
                          setStep('form');
                        }}
                        data-testid="button-book-consultation"
                      >
                        Book Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="mb-12">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                  Happy Pet Parents Review
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Read what our satisfied bird parents have to say about their experience with our Bird Care Subscription service
                </p>
              </div>
              <ReviewCarousel />
            </div>

            {/* Social Proof Widget */}
            <SocialProofWidget />

            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6 text-center">Choose Your Plan - Limited Time Offer!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id} 
                    className={`hover-elevate relative flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''} ${plan.bestValue ? 'border-green-500 shadow-lg' : ''}`}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    {plan.limitedOffer && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-orange-600 text-white">Limited-Time Offer</Badge>
                      </div>
                    )}
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    {plan.bestValue && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-green-600 text-white">Best Value</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pb-4">
                      <CardTitle>
                        <div className="text-2xl font-bold mb-2">{plan.duration}</div>
                        <Badge variant="destructive" className="text-sm mb-3">
                          {plan.discount}
                        </Badge>
                        <div className="mt-3">
                          <div className="text-lg text-muted-foreground line-through mb-1">
                            {plan.originalPrice}
                          </div>
                          <div className="text-4xl font-bold text-primary mb-1">
                            {plan.price}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.period}</p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold text-sm">
                          <Stethoscope className="w-4 h-4" />
                          {plan.consultsText}
                        </div>
                      </div>
                      
                      <ul className="space-y-3 mb-6 flex-1">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="space-y-3">
                        {plan.savings && (
                          <Badge className="w-full bg-green-100 text-green-800 border-green-200 justify-center py-2">
                            {plan.savings}
                          </Badge>
                        )}
                        {subscriptionData?.subscription?.status === 'active' ? (
                          <Button 
                            size="lg" 
                            className="w-full"
                            onClick={() => navigate('/user-dashboard')}
                            data-testid={`button-manage-birds-${plan.id}`}
                          >
                            Manage My Birds
                          </Button>
                        ) : (
                          <Button 
                            size="lg" 
                            className="w-full"
                            onClick={() => {
                              setSelectedPlan(plan.id);
                              setShowPlanModal(true);
                            }}
                            data-testid={`button-choose-${plan.id}`}
                          >
                            Choose Plan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground mt-4 text-sm">
                🎉 Special launch offer - Save up to 30% on longer plans!
              </p>
            </div>

            {/* Instagram Promotional Section */}
            <div className="mb-8">
              <Card className="overflow-hidden">
                <CardContent className="p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-orange-950/20">
                  <div className="text-center space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <span className="text-3xl">✨</span>
                        Special Offer for Fancy Feathers Followers!
                        <span className="text-3xl">✨</span>
                      </h3>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Followers of Fancy Feathers India get an additional exclusive discount!
                        <br />
                        <span className="font-semibold text-foreground">
                          Ask the Fancy Feathers Admin to share a personal discount coupon with you.
                        </span>
                      </p>
                    </div>
                    
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 hover:from-pink-600 hover:via-purple-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={() => window.open('https://www.instagram.com/fancy_feathers_india/', '_blank')}
                      data-testid="button-instagram-contact"
                    >
                      <SiInstagram className="w-6 h-6 mr-2" />
                      Contact Admin on Instagram
                    </Button>

                    <p className="text-sm text-muted-foreground italic">
                      Follow us @fancy_feathers_india for exclusive bird care tips and updates!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-choose-plan">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {selectedPlan && plans.find(p => p.id === selectedPlan)?.duration} Plan Subscription
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6">
              {/* Plan Summary */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {plans.find(p => p.id === selectedPlan)?.duration} Plan
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {plans.find(p => p.id === selectedPlan)?.consultsText}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {plans.find(p => p.id === selectedPlan)?.price}
                    </div>
                    <div className="text-sm text-muted-foreground line-through">
                      {plans.find(p => p.id === selectedPlan)?.originalPrice}
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {plans.find(p => p.id === selectedPlan)?.savings}
                </Badge>
              </div>

              {step === 'initial' && (
                <div className="space-y-4">
                  {!sessionData?.account && (
                    <p className="text-center text-muted-foreground">
                      Complete your subscription in 3 easy steps
                    </p>
                  )}
                  <div className="space-y-4 max-w-md mx-auto">
                    {!sessionData?.account && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="planFullName">Full Name *</Label>
                          <Input
                            id="planFullName"
                            data-testid="input-plan-fullname"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="planMobile">Mobile Number *</Label>
                          <Input
                            id="planMobile"
                            data-testid="input-plan-mobile"
                            placeholder="10-digit mobile number"
                            value={formData.mobileNumber}
                            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                            maxLength={10}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="planSpecies">Bird Species *</Label>
                          <Select
                            value={formData.birdSpecies}
                            onValueChange={(value) => {
                              setFormData({ ...formData, birdSpecies: value });
                              if (value !== 'Other') {
                                setCustomSpecies('');
                              }
                            }}
                          >
                            <SelectTrigger data-testid="select-plan-species">
                              <SelectValue placeholder="Select your bird species" />
                            </SelectTrigger>
                            <SelectContent>
                              {birdSpeciesList.map((species) => (
                                <SelectItem key={species} value={species}>
                                  {species}
                                </SelectItem>
                              ))}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.birdSpecies === 'Other' && (
                          <div className="space-y-2">
                            <Label htmlFor="planCustomSpecies">Specify Bird Species *</Label>
                            <Input
                              id="planCustomSpecies"
                              data-testid="input-plan-custom-species"
                              placeholder="Enter your bird species"
                              value={customSpecies}
                              onChange={(e) => setCustomSpecies(e.target.value)}
                            />
                          </div>
                        )}
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="planCouponCode">Discount Coupon Code (Optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="planCouponCode"
                          data-testid="input-coupon-code"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            // Clear error when user starts typing again
                            if (couponError) {
                              setCouponError('');
                            }
                          }}
                          onBlur={handleCouponApply}
                          className={couponError ? 'border-destructive' : ''}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCouponApply}
                          data-testid="button-apply-coupon"
                        >
                          Apply
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-sm text-destructive flex items-center gap-1" data-testid="text-coupon-error">
                          ❌ {couponError}
                        </p>
                      )}
                      {couponDiscount === -1 && !couponError && (
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1" data-testid="text-coupon-success">
                          ✅ Test coupon applied! Amount set to ₹1 for testing.
                        </p>
                      )}
                      {couponDiscount > 0 && !couponError && (
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1" data-testid="text-coupon-success">
                          ✅ {couponDiscount}% discount applied successfully!
                        </p>
                      )}
                    </div>

                    <Button 
                      onClick={handleFormSubmit}
                      data-testid="button-plan-continue"
                      className="w-full"
                      size="lg"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog with Account Creation Prompt */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">Subscription Successful!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Thank you for subscribing to our Bird Care plan!
              </p>
              {sessionData?.account ? (
                <p className="font-semibold text-primary">
                  Your subscription has been activated. View your dashboard to manage your bird's care.
                </p>
              ) : (
                <p className="font-semibold text-primary">
                  Create your account now to access your dashboard and manage your bird's care.
                </p>
              )}
            </div>
            
            {sessionData?.account ? (
              // User is logged in - show dashboard button
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  navigate('/user-dashboard');
                  setShowSuccessDialog(false);
                }}
                data-testid="button-view-dashboard"
              >
                View My Dashboard
              </Button>
            ) : (
              // User is NOT logged in - show create account button
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  if (successData) {
                    navigate(`/user-account/register/${successData.mobileNumber}/${successData.subscriptionId}`);
                    setShowSuccessDialog(false);
                  }
                }}
                data-testid="button-create-account"
              >
                Create Your Account
              </Button>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (successData) {
                  const message = `Hi there, I have just subscribed to the Bird Care plan. Here are my details:\n\nName: ${successData.fullName}\n\nMobile Number: ${successData.mobileNumber}\n\nTransaction ID: ${successData.transactionId}\n\nSubscription Type: ${successData.planType}`;
                  const whatsappUrl = `https://wa.me/919014284059?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank');
                }
              }}
              data-testid="button-whatsapp-contact"
            >
              Contact on WhatsApp
            </Button>
            
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => setShowSuccessDialog(false)}
              data-testid="button-close-success"
            >
              {sessionData?.account ? 'Close' : "I'll create my account later"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
