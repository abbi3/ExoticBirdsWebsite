import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, AlertCircle, CheckCircle2, Phone, Bird } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import Header from "@/components/Header";

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(undefined);
  const [birdName, setBirdName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: userAccount, isLoading: loadingAccount } = useQuery<any>({
    queryKey: ["/api/user-account/session"],
  });

  const { data: subscriptionData, isLoading: loadingSubscription } = useQuery<any>({
    queryKey: ["/api/user-account/subscription"],
    enabled: !!userAccount?.account,
  });

  const subscription = subscriptionData?.subscription;

  const { data: settingsData } = useQuery<any>({
    queryKey: ["/api/appointment-settings"],
  });

  const settings = settingsData?.settings;

  const { data: slotsData, isLoading: loadingSlots } = useQuery<any>({
    queryKey: ["/api/appointments/available-slots", selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch(`/api/appointments/available-slots?date=${dateStr}`);
      if (!response.ok) throw new Error("Failed to fetch slots");
      return response.json();
    },
    enabled: !!selectedDate,
  });

  const availableSlots = slotsData?.slots
    ?.filter((slot: any) => slot.available)
    ?.map((slot: any) => slot.time) || [];

  const { data: userBirds, isLoading: loadingBirds } = useQuery<any[]>({
    queryKey: ["/api/bird-details"],
    enabled: !!userAccount?.account,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: {
      appointmentDate: string;
      slotStartTime: string;
      slotEndTime : string;
      birdName: string;
      userPhone : string;
      symptoms: string;
      subscriptionId : string;
    }) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-account/subscription"] });
      setShowConfirmDialog(false);
      toast({
        title: "Appointment Booked!",
        description: "Your consultation has been scheduled successfully.",
      });
      navigate("/user-dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    },
  });

  if (loadingAccount || loadingSubscription) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!userAccount?.account) {
    navigate("/user-account/login");
    return null;
  }

  if (!subscription || subscription.status !== "active" || subscription.consultationsRemaining === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                No Active Subscription
              </CardTitle>
              <CardDescription>
                You need an active subscription with available consultations to book appointments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription?.consultationsRemaining === 0 && (
                <p className="text-sm text-muted-foreground">
                  You have used all consultations in your current plan. Please renew or upgrade your subscription.
                </p>
              )}
              <div className="flex gap-4">
                <Button onClick={() => navigate("/subscription")} data-testid="button-subscribe">
                  Subscribe Now
                </Button>
                <Button variant="outline" onClick={() => navigate("/user-dashboard")} data-testid="button-dashboard">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const maxDate = addDays(new Date(), settings?.maxDaysAdvanceBooking || 30);

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot || !birdName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a date, time slot, and bird name",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    if (!selectedDate || !selectedSlot || !birdName.trim() || !subscription) return;

    // Calculate slot end time (add 30 minutes to start time)
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const endMinutes = minutes + (settings?.slotDuration || 30);
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;
    const slotEndTime = `${String(endHours).padStart(2, '0')}:${String(finalMinutes).padStart(2, '0')}`;

    createAppointmentMutation.mutate({
      userPhone: userAccount.account.phone,
      subscriptionId: subscription.id,
      appointmentDate: format(selectedDate, "yyyy-MM-dd"),
      slotStartTime: selectedSlot,
      slotEndTime: slotEndTime,
      birdName: birdName.trim(),
      symptoms: symptoms.trim() || "No specific symptoms mentioned",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
              Book Consultation
            </h1>
            <p className="text-muted-foreground">
              Schedule a veterinary consultation for your bird
            </p>
            <div className="mt-4 flex gap-4 flex-wrap">
              <Badge variant="secondary" data-testid="badge-consultations">
                <Clock className="h-3 w-3 mr-1" />
                {subscription.consultationsRemaining} consultations remaining
              </Badge>
              <Badge variant="outline" data-testid="badge-plan">
                {subscription.subscriptionPlan} Plan
              </Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date
                </CardTitle>
                <CardDescription>
                  Choose a date within the next {settings?.maxDaysAdvanceBooking || 30} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    isBefore(date, startOfDay(new Date())) ||
                    isAfter(date, maxDate) ||
                    (settings?.weekendBookingEnabled === false && (date.getDay() === 0 || date.getDay() === 6))
                  }
                  className="rounded-md border"
                  data-testid="calendar-date-picker"
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Available Time Slots
                    </CardTitle>
                    <CardDescription>
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingSlots ? (
                      <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : availableSlots && availableSlots.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map((slot: string) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? "default" : "outline"}
                            onClick={() => setSelectedSlot(slot)}
                            className="w-full"
                            data-testid={`button-slot-${slot.replace(":", "")}`}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No available slots for this date
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {selectedSlot && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bird className="h-5 w-5" />
                      Appointment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Bird Name <span className="text-destructive">*</span>
                      </label>
                      {loadingBirds ? (
                        <Skeleton className="h-10 w-full" />
                      ) : userBirds && userBirds.length > 0 ? (
                        <Select value={birdName} onValueChange={setBirdName}>
                          <SelectTrigger data-testid="select-bird">
                            <SelectValue placeholder="Select your bird" />
                          </SelectTrigger>
                          <SelectContent>
                            {userBirds.map((bird: any) => (
                              <SelectItem key={bird.id} value={bird.birdName}>
                                {bird.birdName} ({bird.species})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          placeholder="Enter bird name"
                          value={birdName}
                          onChange={(e) => setBirdName(e.target.value)}
                          data-testid="input-bird-name"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Symptoms / Reason for Consultation
                      </label>
                      <Textarea
                        placeholder="Describe any symptoms or concerns..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={4}
                        data-testid="textarea-symptoms"
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleConfirmBooking}
                      disabled={!birdName.trim()}
                      data-testid="button-book-appointment"
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent data-testid="dialog-confirm-booking">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Confirm Appointment
            </DialogTitle>
            <DialogDescription>
              Please review your appointment details before confirming
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p className="text-sm font-semibold" data-testid="text-confirm-date">
                  {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Time</p>
                <p className="text-sm font-semibold" data-testid="text-confirm-time">{selectedSlot}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bird</p>
                <p className="text-sm font-semibold" data-testid="text-confirm-bird">{birdName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consultations After</p>
                <p className="text-sm font-semibold" data-testid="text-confirm-consultations">
                  {(subscription?.consultationsRemaining || 1) - 1} remaining
                </p>
              </div>
            </div>
            {symptoms && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Symptoms</p>
                <p className="text-sm" data-testid="text-confirm-symptoms">{symptoms}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              data-testid="button-cancel-confirm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFinalConfirm}
              disabled={createAppointmentMutation.isPending}
              data-testid="button-final-confirm"
            >
              {createAppointmentMutation.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
