import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface OTPVerificationProps {
  phone: string;
  onVerified: () => void;
  onCancel?: () => void;
}

export function OTPVerification({ phone, onVerified, onCancel }: OTPVerificationProps) {
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const verifyOtpMutation = useMutation({
    mutationFn: async (data: { phone: string; otp: string }) => {
      const response = await apiRequest("POST", "/api/otp/verify", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setIsVerified(true);
      toast({
        title: "Success!",
        description: data.message || "OTP verified successfully!",
      });
      setTimeout(() => {
        onVerified();
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired OTP. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (data: { phone: string }) => {
      const response = await apiRequest("POST", "/api/otp/resend", data);
      return await response.json();
    },
    onSuccess: (data) => {
      setResendCooldown(30);
      toast({
        title: "OTP Sent",
        description: data.message || "A new OTP has been sent to your mobile number.",
      });
    },
    onError: (error: any) => {
      if (error.message.includes("wait")) {
        toast({
          title: "Please Wait",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Send OTP",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
      }
    },
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 4-digit OTP",
        variant: "destructive",
      });
      return;
    }
    verifyOtpMutation.mutate({ phone, otp });
  };

  const handleResend = () => {
    resendOtpMutation.mutate({ phone });
  };

  const formatPhone = (phoneNumber: string) => {
    if (phoneNumber.length === 10) {
      return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`;
    }
    return phoneNumber;
  };

  return (
    <div className="space-y-6" data-testid="otp-verification-container">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          {isVerified ? (
            <CheckCircle2 className="h-12 w-12 text-green-500" data-testid="icon-verified" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold" data-testid="text-title">
          {isVerified ? "Verified!" : "Verify Your Mobile Number"}
        </h3>
        <p className="text-sm text-muted-foreground" data-testid="text-description">
          {isVerified 
            ? "Your mobile number has been verified successfully!"
            : `Enter the 4-digit code sent to ${formatPhone(phone)}`
          }
        </p>
      </div>

      {!isVerified && (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="1234"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-widest font-semibold"
              disabled={verifyOtpMutation.isPending}
              data-testid="input-otp"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={verifyOtpMutation.isPending || otp.length !== 4}
            data-testid="button-verify-otp"
          >
            {verifyOtpMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Didn't receive the code?</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resendOtpMutation.isPending}
              data-testid="button-resend-otp"
              className="p-0 h-auto hover:bg-transparent"
            >
              {resendOtpMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : null}
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : "Resend OTP"
              }
            </Button>
          </div>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onCancel}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
          )}
        </form>
      )}
    </div>
  );
}
