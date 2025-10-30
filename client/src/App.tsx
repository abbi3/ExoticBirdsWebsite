import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import BirdProfile from "@/pages/BirdProfile";
import About from "@/pages/About";
import BirdCareSubscription from "@/pages/BirdCareSubscription";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import UserAccountRegister from "@/pages/UserAccountRegister";
import UserAccountLogin from "@/pages/UserAccountLogin";
import UserDashboard from "@/pages/UserDashboard";
import BookAppointment from "@/pages/BookAppointment";
import TermsAndConditions from "@/pages/TermsAndConditions";
import CancellationRefund from "@/pages/CancellationRefund";
import ShippingPolicy from "@/pages/ShippingPolicy";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ContactUs from "@/pages/ContactUs";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/bird/:slug" component={BirdProfile} />
      <Route path="/about" component={About} />
      <Route path="/subscription" component={BirdCareSubscription} />
      <Route path="/bird-care" component={BirdCareSubscription} />
      <Route path="/bird-care-subscription" component={BirdCareSubscription} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/user-account/register/:phone/:subscriptionId?" component={UserAccountRegister} />
      <Route path="/user-account/login" component={UserAccountLogin} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route path="/book-appointment" component={BookAppointment} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/cancellation-refund" component={CancellationRefund} />
      <Route path="/shipping-policy" component={ShippingPolicy} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/contact-us" component={ContactUs} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
