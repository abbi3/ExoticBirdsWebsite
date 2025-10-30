import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OTPVerification } from "@/components/OTPVerification";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupStep, setSignupStep] = useState<"mobile" | "otp" | "password">("mobile");
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
    countryCode: "+91",
  });
  const [signupData, setSignupData] = useState({
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
    countryCode: "+91",
  });

  // Country-specific phone validation
  const validatePhoneNumber = (phone: string, countryCode: string) => {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    switch (countryCode) {
      case "+91": // India
        return /^[6-9]\d{9}$/.test(digits);
      case "+1": // USA/Canada
        return /^\d{10}$/.test(digits);
      case "+44": // UK
        return /^\d{10,11}$/.test(digits);
      case "+61": // Australia
        return /^\d{9,10}$/.test(digits);
      case "+971": // UAE
        return /^\d{9}$/.test(digits);
      case "+966": // Saudi Arabia
        return /^\d{9}$/.test(digits);
      case "+65": // Singapore
        return /^\d{8}$/.test(digits);
      default:
        // Generic validation: 7-15 digits
        return /^\d{7,15}$/.test(digits);
    }
  };

  const getPhoneNumberLength = (countryCode: string) => {
    switch (countryCode) {
      case "+91": return 10; // India
      case "+1": return 10; // USA/Canada
      case "+44": return "10-11"; // UK
      case "+61": return "9-10"; // Australia
      case "+971": return 9; // UAE
      case "+966": return 9; // Saudi Arabia
      case "+65": return 8; // Singapore
      default: return "7-15";
    }
  };

  const loginMutation = useMutation({
    mutationFn: async (data: { mobile: string; password: string }) => {
      const response = await apiRequest('POST', '/api/login', data);
      return await response.json();  // Parse JSON from Response object
    },
    onSuccess: (data: any) => {
      console.log('[LOGIN] Success callback triggered', data);
      const userType = data.userType || "user";
      const redirectTo = data.redirectTo || "/user-dashboard";
      console.log('[LOGIN] Redirecting to:', redirectTo);
      
      toast({
        title: "Login Successful",
        description: userType === "admin" 
          ? "Welcome to the admin dashboard!" 
          : "Welcome back! Redirecting to your dashboard...",
      });
      
      // Use window.location for more reliable redirect
      console.log('[LOGIN] Setting up redirect in 500ms...');
      setTimeout(() => {
        console.log('[LOGIN] Executing redirect now to:', redirectTo);
        window.location.href = redirectTo;
      }, 500);
    },
    onError: (error: any) => {
      console.error('[LOGIN] Error callback triggered:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid mobile number or password",
        variant: "destructive",
      });
    }
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (data: { phone: string }) => {
      const response = await apiRequest('POST', '/api/otp/send', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "OTP Sent",
        description: data.message || "An OTP has been sent to your mobile number.",
      });
      setSignupStep("otp");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  });

  const countryCodes = [
    { code: "+91", country: "India", flag: "🇮🇳" },
    { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+61", country: "Australia", flag: "🇦🇺" },
    { code: "+971", country: "UAE", flag: "🇦🇪" },
    { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
    { code: "+65", country: "Singapore", flag: "🇸🇬" },
    { code: "+92", country: "Pakistan", flag: "🇵🇰" },
    { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
    { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  ];

  const signupMutation = useMutation({
    mutationFn: async (data: { phone: string; username: string; password: string }) => {
      const response = await apiRequest('POST', '/api/user-account/signup', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created",
        description: data.message || "Your account has been created successfully. Logging you in...",
      });
      setSignupOpen(false);
      setSignupStep("mobile");
      setSignupData({ mobile: "", username: "", password: "", confirmPassword: "", countryCode: "+91" });
      setLocation("/user-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    if (!formData.password || formData.password.length < 1) {
      toast({
        title: "Validation Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    // Send full phone number with country code for login
    const fullPhone = formData.countryCode + formData.mobile.replace(/\D/g, '');
    loginMutation.mutate({
      mobile: fullPhone,
      password: formData.password,
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send full phone number with country code
    const fullPhone = signupData.countryCode + signupData.mobile.replace(/\D/g, '');
    sendOtpMutation.mutate({ phone: fullPhone });
  };

  const handleOtpVerified = () => {
    setSignupStep("password");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username
    if (signupData.username.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters with 1 uppercase, 1 number, and 1 special character",
        variant: "destructive",
      });
      return;
    }

    // Validate password confirmation
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match. Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    // Send full phone number with country code
    const fullPhone = signupData.countryCode + signupData.mobile.replace(/\D/g, '');
    signupMutation.mutate({
      phone: fullPhone,
      username: signupData.username,
      password: signupData.password,
    });
  };

  const handleSignupDialogChange = (open: boolean) => {
    setSignupOpen(open);
    if (!open) {
      // Reset signup form and step when dialog closes
      setSignupStep("mobile");
      setSignupData({ mobile: "", username: "", password: "", confirmPassword: "", countryCode: "+91" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Login to Your Account</CardTitle>
              <CardDescription className="text-center">
                Enter your mobile number and password to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">
                    Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => {
                        setFormData({ ...formData, countryCode: value, mobile: "" });
                      }}
                    >
                      <SelectTrigger className="w-[140px]" data-testid="select-login-country-code">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <span>{countryCodes.find(c => c.code === formData.countryCode)?.flag}</span>
                            <span>{formData.countryCode}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span className="font-medium">{country.country}</span>
                              <span className="text-muted-foreground">{country.code}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder={formData.countryCode === "+91" ? "9876543210" : "Phone number"}
                      value={formData.mobile}
                      onChange={(e) => {
                        let digits = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, mobile: digits.slice(0, 15) });
                      }}
                      required
                      data-testid="input-mobile"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Dialog open={signupOpen} onOpenChange={handleSignupDialogChange}>
                    <DialogTrigger asChild>
                      <span className="text-primary hover:underline cursor-pointer" data-testid="link-signup">
                        Signup
                      </span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          {signupStep === "mobile" && "Create New Account"}
                          {signupStep === "otp" && "Verify Mobile Number"}
                          {signupStep === "password" && "Complete Your Profile"}
                        </DialogTitle>
                        <DialogDescription>
                          {signupStep === "mobile" && "Enter your mobile number to get started"}
                          {signupStep === "otp" && "We've sent a verification code to your phone"}
                          {signupStep === "password" && "Set your username and password"}
                        </DialogDescription>
                      </DialogHeader>

                      {signupStep === "mobile" && (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signup-mobile">
                              Mobile Number <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex gap-2">
                              <Select
                                value={signupData.countryCode}
                                onValueChange={(value) => {
                                  setSignupData({ ...signupData, countryCode: value, mobile: "" });
                                }}
                              >
                                <SelectTrigger className="w-[140px]" data-testid="select-country-code">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {countryCodes.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      <span className="flex items-center gap-2">
                                        <span>{country.flag}</span>
                                        <span>{country.code}</span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                id="signup-mobile"
                                type="tel"
                                placeholder={signupData.countryCode === "+91" ? "9876543210" : "Phone number"}
                                value={signupData.mobile}
                                onChange={(e) => {
                                  let digits = e.target.value.replace(/\D/g, '');
                                  setSignupData({ ...signupData, mobile: digits.slice(0, 15) });
                                }}
                                required
                                data-testid="input-signup-mobile"
                                autoFocus
                                className="flex-1"
                              />
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={sendOtpMutation.isPending}
                            data-testid="button-send-otp"
                          >
                            {sendOtpMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending OTP...
                              </>
                            ) : (
                              "Send OTP"
                            )}
                          </Button>
                        </form>
                      )}

                      {signupStep === "otp" && (
                        <OTPVerification
                          phone={signupData.countryCode + signupData.mobile.replace(/\D/g, '')}
                          onVerified={handleOtpVerified}
                          onCancel={() => setSignupStep("mobile")}
                        />
                      )}

                      {signupStep === "password" && (
                        <form onSubmit={handleSignup} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="signup-username">
                              Username <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="signup-username"
                              type="text"
                              placeholder="Enter your name"
                              value={signupData.username}
                              onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                              required
                              data-testid="input-signup-username"
                              autoFocus
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-password">
                              Password <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="signup-password"
                                type={showSignupPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                required
                                data-testid="input-signup-password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowSignupPassword(!showSignupPassword)}
                                data-testid="button-toggle-signup-password"
                              >
                                {showSignupPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Min 8 characters, 1 uppercase, 1 number, 1 special character
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="signup-confirm-password">
                              Confirm Password <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="signup-confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Re-enter your password"
                                value={signupData.confirmPassword}
                                onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                required
                                data-testid="input-signup-confirm-password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                data-testid="button-toggle-confirm-password"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Both passwords must match
                            </p>
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={signupMutation.isPending}
                            data-testid="button-signup-submit"
                          >
                            {signupMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Account...
                              </>
                            ) : (
                              "Create Account"
                            )}
                          </Button>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
