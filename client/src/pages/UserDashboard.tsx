import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, Bird, Calendar, CreditCard, Tag, LogOut, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import SubscriptionPrompt from "@/components/SubscriptionPrompt";

const birdFormSchema = z.object({
  birdName: z.string().min(1, "Bird name is required"),
  species: z.string().min(1, "Species is required"),
  ringId: z.string().optional(),
  weight: z.string().optional(),
  age: z.string().optional(),
  issues: z.string().optional(),
});

type BirdFormData = z.infer<typeof birdFormSchema>;

interface BirdDetail {
  id: string;
  birdName: string;
  species: string;
  ringId?: string;
  weight?: number;
  age?: string;
  issues?: string;
}

export default function UserDashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showBirdForm, setShowBirdForm] = useState(false);
  const [editingBird, setEditingBird] = useState<BirdDetail | null>(null);
  const [deleteBirdId, setDeleteBirdId] = useState<string | null>(null);

  const form = useForm<BirdFormData>({
    resolver: zodResolver(birdFormSchema),
    defaultValues: {
      birdName: "",
      species: "",
      ringId: "",
      weight: "",
      age: "",
      issues: "",
    },
  });

  // Fetch user session
  const { data: sessionData, isLoading: sessionLoading } = useQuery<any>({
    queryKey: ["/api/user-account/session"],
  });

  // Fetch subscription details
  const { data: subscriptionData, isLoading: subscriptionLoading } = useQuery<any>({
    queryKey: ["/api/user-account/subscription"],
    enabled: !!sessionData?.account,
  });

  // Fetch bird details
  const { data: birdsData, isLoading: birdsLoading } = useQuery<any>({
    queryKey: ["/api/bird-details"],
    enabled: !!sessionData?.account,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/user-account/logout", {});
    },
    onSuccess: () => {
      navigate("/login");
    },
  });

  const saveBirdMutation = useMutation({
    mutationFn: async (data: BirdFormData) => {
      const payload = {
        ...data,
        weight: data.weight ? parseInt(data.weight) : undefined,
      };
      if (editingBird) {
        return await apiRequest("PATCH", `/api/bird-details/${editingBird.id}`, payload);
      } else {
        return await apiRequest("POST", "/api/bird-details", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bird-details"] });
      setShowBirdForm(false);
      setEditingBird(null);
      form.reset();
      toast({
        title: editingBird ? "Bird Updated" : "Bird Added",
        description: editingBird ? "Bird details updated successfully." : "Your bird's details have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save bird details",
        variant: "destructive",
      });
    },
  });

  const deleteBirdMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/bird-details/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bird-details"] });
      setDeleteBirdId(null);
      toast({
        title: "Bird Deleted",
        description: "Bird deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete bird",
        variant: "destructive",
      });
    },
  });

  const handleEditBird = (bird: BirdDetail) => {
    setEditingBird(bird);
    form.reset({
      birdName: bird.birdName,
      species: bird.species,
      ringId: bird.ringId || "",
      weight: bird.weight ? bird.weight.toString() : "",
      age: bird.age || "",
      issues: bird.issues || "",
    });
    setShowBirdForm(true);
  };

  const handleAddNewBird = () => {
    setEditingBird(null);
    form.reset({
      birdName: "",
      species: "",
      ringId: "",
      weight: "",
      age: "",
      issues: "",
    });
    setShowBirdForm(true);
  };

  const onSubmitBird = (data: BirdFormData) => {
    saveBirdMutation.mutate(data);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !sessionData?.account) {
      navigate("/login");
    }
  }, [sessionLoading, sessionData, navigate]);

  if (sessionLoading || subscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sessionData?.account) {
    return null;
  }

  const subscription = subscriptionData?.subscription;
  const birds = birdsData?.birds || [];

  const getStatusBadge = (status: string) => {
    if (status === "active") return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
    if (status === "expired") return <Badge variant="destructive">Expired</Badge>;
    if (status === "exhausted") return <Badge variant="secondary">Consultations Exhausted</Badge>;
    return <Badge>{status}</Badge>;
  };

  const getPlanName = (plan: string) => {
    if (plan === "monthly") return "Monthly";
    if (plan === "six-month") return "6 Months";
    if (plan === "annual") return "Annual";
    return plan;
  };

  const totalConsultations = subscription?.consultationsRemaining !== undefined
    ? (subscription.subscriptionPlan === "monthly" ? 2
      : subscription.subscriptionPlan === "six-month" ? 18
      : 48)
    : 0;

  const used = totalConsultations - (subscription?.consultationsRemaining || 0);
  const remaining = subscription?.consultationsRemaining || 0;
  const percentage = totalConsultations > 0 ? (used / totalConsultations) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back!</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Subscription Status or Prompt */}
        {subscription ? (
          <>
            {/* Subscription Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <p className="font-semibold" data-testid="text-plan">{getPlanName(subscription.subscriptionPlan)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-semibold" data-testid="text-start-date">
                      {format(new Date(subscription.subscriptionStartDate), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-semibold" data-testid="text-end-date">
                      {format(new Date(subscription.subscriptionEndDate), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-semibold" data-testid="text-amount-paid">₹{subscription.amountPaid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Coupon Code</p>
                    <p className="font-semibold" data-testid="text-coupon">{subscription.discountCoupon || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div data-testid="badge-status">{getStatusBadge(subscription.status)}</div>
                  </div>
                </div>

                {subscription.status === "exhausted" && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      ⚠️ You have used all your consultations for this plan. Please purchase a top-up plan to continue.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Consultation Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Consultation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold" data-testid="text-total-consultations">{totalConsultations}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-amber-600" data-testid="text-used-consultations">{used}</p>
                    <p className="text-sm text-muted-foreground">Used</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600" data-testid="text-remaining-consultations">{remaining}</p>
                    <p className="text-sm text-muted-foreground">Remaining</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{Math.round(percentage)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" data-testid="progress-consultations" />
                </div>
              </CardContent>
            </Card>

            {/* Book Appointment Card */}
            {subscription.status === "active" && subscription.consultationsRemaining > 0 && (
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Book a Consultation
                  </CardTitle>
                  <CardDescription>
                    Schedule a veterinary consultation for your bird
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => navigate("/book-appointment")}
                    size="lg"
                    className="w-full"
                    data-testid="button-book-appointment"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <SubscriptionPrompt />
        )}

        {/* Bird Details Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bird className="h-5 w-5" />
                My Birds
              </CardTitle>
              <CardDescription>Manage your bird's information</CardDescription>
            </div>
            <Button onClick={handleAddNewBird} data-testid="button-add-bird">
              <Plus className="h-4 w-4 mr-2" />
              Add Bird
            </Button>
          </CardHeader>
          <CardContent>
            {birdsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : birds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bird className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No birds added yet. Click "Add Bird" to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {birds.map((bird: BirdDetail) => (
                  <Card key={bird.id} className="border-2" data-testid={`card-bird-${bird.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{bird.birdName}</CardTitle>
                          <CardDescription>{bird.species}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditBird(bird)}
                            data-testid={`button-edit-bird-${bird.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteBirdId(bird.id)}
                            data-testid={`button-delete-bird-${bird.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {bird.ringId && (
                        <div>
                          <span className="text-muted-foreground">Ring ID:</span> {bird.ringId}
                        </div>
                      )}
                      {bird.weight && (
                        <div>
                          <span className="text-muted-foreground">Weight:</span> {bird.weight}g
                        </div>
                      )}
                      {bird.age && (
                        <div>
                          <span className="text-muted-foreground">Age:</span> {bird.age}
                        </div>
                      )}
                      {bird.issues && (
                        <div>
                          <span className="text-muted-foreground">Issues:</span>
                          <p className="mt-1 text-xs">{bird.issues}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bird Form Dialog */}
      <Dialog open={showBirdForm} onOpenChange={(open) => {
        setShowBirdForm(open);
        if (!open) {
          setEditingBird(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBird ? "Edit Bird Details" : "Add New Bird"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitBird)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birdName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bird Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Charlie" data-testid="input-bird-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Species *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Macaw, Cockatoo" data-testid="input-species" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ringId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ring ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., ABC123" data-testid="input-ring-id" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (grams)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="e.g., 450" data-testid="input-weight" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2 years, 6 months" data-testid="input-age" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="issues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issues / Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe any health issues, symptoms, or behavioral concerns"
                        rows={4}
                        data-testid="textarea-issues"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowBirdForm(false);
                    setEditingBird(null);
                    form.reset();
                  }}
                  data-testid="button-cancel-bird"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saveBirdMutation.isPending}
                  data-testid="button-save-bird"
                >
                  {saveBirdMutation.isPending ? "Saving..." : (editingBird ? "Update" : "Save")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteBirdId} onOpenChange={() => setDeleteBirdId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bird?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bird? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteBirdId && deleteBirdMutation.mutate(deleteBirdId)}
              className="bg-destructive hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
