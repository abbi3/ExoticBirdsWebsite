import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Filter,
  UserX
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import AdminAppointments from "@/components/AdminAppointments";

type UserSubscription = {
  phone: string;
  fullName: string;
  isMobileVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  subscriptionStatus: "Active" | "Expired" | "Exhausted" | "No Subscription";
  subscription: {
    id: string;
    subscriptionPlan: string;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    amountPaid: number;
    consultationsRemaining: number;
    status: string;
    birdSpecies: string;
    discountCoupon: string | null;
    razorpayOrderId: string | null;
    razorpayPaymentId: string | null;
    paymentStatus: string | null;
  } | null;
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserSubscription | null>(null);
  const [viewMode, setViewMode] = useState<"view" | "edit" | null>(null);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState<string | null>(null);
  const [deleteUserPhone, setDeleteUserPhone] = useState<string | null>(null);
  const [consultationUpdateId, setConsultationUpdateId] = useState<string | null>(null);
  const [customConsultations, setCustomConsultations] = useState<number>(0);
  const [editFormData, setEditFormData] = useState<any>({});
  const [metricsValue, setMetricsValue] = useState<number>(0);
  const [metricsReason, setMetricsReason] = useState<string>("");
  const [showMetricsDialog, setShowMetricsDialog] = useState(false);

  // Check admin session
  const { data: sessionData } = useQuery<{ admin: any }>({
    queryKey: ["/api/admin/session"],
  });

  useEffect(() => {
    if (sessionData && !sessionData.admin) {
      setLocation("/admin/login");
    }
  }, [sessionData, setLocation]);

  // Fetch unified user-subscriptions data
  const { data: userSubscriptionsData, isLoading } = useQuery<{ userSubscriptions: UserSubscription[] }>({
    queryKey: ["/api/admin/user-subscriptions"],
    enabled: !!sessionData?.admin,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/session"] });
      setLocation("/login");
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PATCH", `/api/admin/subscriptions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-subscriptions"] });
      setViewMode(null);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "Subscription updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      });
    },
  });

  const updateConsultationsMutation = useMutation({
    mutationFn: async ({ id, consultations }: { id: string; consultations: number }) => {
      return await apiRequest("POST", `/api/admin/subscriptions/${id}/consultations`, { consultations });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-subscriptions"] });
      setConsultationUpdateId(null);
      setCustomConsultations(0);
      toast({
        title: "Success",
        description: "Consultations Updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update consultations",
        variant: "destructive",
      });
    },
  });

  const deleteSubscriptionMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/subscriptions/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-subscriptions"] });
      setDeleteSubscriptionId(null);
      toast({
        title: "Success",
        description: "Subscription deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription",
        variant: "destructive",
      });
    },
  });

  const deleteUserAccountMutation = useMutation({
    mutationFn: async (phone: string) => {
      return await apiRequest("DELETE", `/api/admin/user-accounts/${encodeURIComponent(phone)}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-subscriptions"] });
      setDeleteUserPhone(null);
      toast({
        title: "Success",
        description: "User account deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user account",
        variant: "destructive",
      });
    },
  });

  // Fetch metrics
  const { data: activeSubscriptionsMetric } = useQuery<{ value: number; last_updated: string }>({
    queryKey: ["/api/metrics/active-subscriptions"],
    enabled: !!sessionData?.admin,
  });

  const updateMetricsMutation = useMutation({
    mutationFn: async ({ value, reason }: { value: number; reason: string }) => {
      return await apiRequest("POST", "/api/admin/metrics/active-subscriptions", { value, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/metrics/active-subscriptions"] });
      setShowMetricsDialog(false);
      setMetricsValue(0);
      setMetricsReason("");
      toast({
        title: "Success",
        description: "Metrics updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update metrics",
        variant: "destructive",
      });
    },
  });

  const handleConsultationUpdate = (subscriptionId: string, consultations: number) => {
    updateConsultationsMutation.mutate({ id: subscriptionId, consultations });
  };

  const handleSubscriptionEdit = (user: UserSubscription) => {
    if (user.subscription) {
      setSelectedUser(user);
      setEditFormData({
        fullName: user.fullName,
        mobileNumber: user.phone,
        birdSpecies: user.subscription.birdSpecies,
        subscriptionPlan: user.subscription.subscriptionPlan,
        subscriptionStartDate: user.subscription.subscriptionStartDate,
        subscriptionEndDate: user.subscription.subscriptionEndDate,
        amountPaid: user.subscription.amountPaid,
        consultationsRemaining: user.subscription.consultationsRemaining,
        status: user.subscription.status,
      });
      setViewMode("edit");
    }
  };

  const handleSaveEdit = () => {
    if (selectedUser?.subscription) {
      updateSubscriptionMutation.mutate({
        id: selectedUser.subscription.id,
        data: editFormData,
      });
    }
  };

  // Filter and search logic
  const filteredUsers = userSubscriptionsData?.userSubscriptions.filter((user) => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === "all" || 
      user.subscriptionStatus.toLowerCase().replace(" ", "-") === filterStatus;
    
    const matchesPlan = 
      filterPlan === "all" || 
      (user.subscription && user.subscription.subscriptionPlan === filterPlan);
    
    return matchesSearch && matchesStatus && matchesPlan;
  }) || [];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "default";
      case "Expired":
        return "secondary";
      case "Exhausted":
        return "secondary";
      case "No Subscription":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            data-testid="button-logout"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Social Proof Metrics Management */}
        <Card>
          <CardHeader>
            <CardTitle>Social Proof Metrics</CardTitle>
            <CardDescription>Manage active subscriptions count displayed on the subscription page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary">
                    {activeSubscriptionsMetric?.value || 0}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Current Active Subscriptions Count</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {activeSubscriptionsMetric?.last_updated 
                      ? format(new Date(activeSubscriptionsMetric.last_updated), "PPp")
                      : "Never"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 flex items-center justify-center">
                  <Button
                    onClick={() => {
                      setMetricsValue(activeSubscriptionsMetric?.value || 0);
                      setShowMetricsDialog(true);
                    }}
                    data-testid="button-update-metrics"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Metrics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage all users and their subscription status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  data-testid="input-search"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-status">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="exhausted">Exhausted</SelectItem>
                  <SelectItem value="no-subscription">No Subscription</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-filter-plan">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="six-month">6-Month</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {userSubscriptionsData?.userSubscriptions.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">
                    {userSubscriptionsData?.userSubscriptions.filter(u => u.subscriptionStatus === "Active").length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Active Subscriptions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-orange-600">
                    {userSubscriptionsData?.userSubscriptions.filter(u => u.subscriptionStatus === "Expired").length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Expired</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-gray-600">
                    {userSubscriptionsData?.userSubscriptions.filter(u => u.subscriptionStatus === "No Subscription").length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">No Subscription</p>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Subscription Status</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.phone}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.phone}</div>
                            {user.isMobileVerified && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.subscriptionStatus)}>
                            {user.subscriptionStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.subscription ? (
                            <span className="capitalize">
                              {user.subscription.subscriptionPlan.replace("-", " ")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.subscription ? (
                            <span>{user.subscription.consultationsRemaining}</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.subscription ? (
                            <span className="text-sm">
                              {format(new Date(user.subscription.subscriptionEndDate), "MMM d, yyyy")}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setViewMode("view");
                                    }}
                                    data-testid={`button-view-${user.phone}`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Details</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {user.subscription && (
                              <>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleSubscriptionEdit(user)}
                                        data-testid={`button-edit-${user.subscription?.id}`}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Subscription</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setConsultationUpdateId(user.subscription?.id || null)}
                                        data-testid={`button-update-consultations-${user.subscription?.id}`}
                                      >
                                        <RefreshCw className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Update Consultations</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setDeleteSubscriptionId(user.subscription?.id || null)}
                                        data-testid={`button-delete-subscription-${user.subscription?.id}`}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete Subscription</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </>
                            )}

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setDeleteUserPhone(user.phone)}
                                    data-testid={`button-delete-user-${user.phone}`}
                                  >
                                    <UserX className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete User Account</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Management Section */}
        <AdminAppointments />
      </main>

      {/* View/Edit Subscription Dialog */}
      <Dialog open={viewMode !== null} onOpenChange={() => setViewMode(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === "view" ? "User Details" : "Edit Subscription"}
            </DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Name</Label>
                  {viewMode === "view" ? (
                    <p className="font-medium">{selectedUser.fullName}</p>
                  ) : (
                    <Input
                      value={editFormData.fullName || ""}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      data-testid="input-edit-name"
                    />
                  )}
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mobile</Label>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Verification Status</Label>
                  <p>
                    {selectedUser.isMobileVerified ? (
                      <Badge variant="outline">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Unverified</Badge>
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Subscription Status</Label>
                  <p>
                    <Badge variant={getStatusBadgeVariant(selectedUser.subscriptionStatus)}>
                      {selectedUser.subscriptionStatus}
                    </Badge>
                  </p>
                </div>
              </div>

              {selectedUser.subscription && (
                <>
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold mb-3">Subscription Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Plan</Label>
                        {viewMode === "view" ? (
                          <p className="font-medium capitalize">
                            {selectedUser.subscription.subscriptionPlan.replace("-", " ")}
                          </p>
                        ) : (
                          <Select
                            value={editFormData.subscriptionPlan}
                            onValueChange={(value) => setEditFormData({ ...editFormData, subscriptionPlan: value })}
                          >
                            <SelectTrigger data-testid="select-edit-plan">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="six-month">6-Month</SelectItem>
                              <SelectItem value="annual">Annual</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Bird Species</Label>
                        {viewMode === "view" ? (
                          <p className="font-medium">{selectedUser.subscription.birdSpecies}</p>
                        ) : (
                          <Input
                            value={editFormData.birdSpecies || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, birdSpecies: e.target.value })}
                            data-testid="input-edit-species"
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Amount Paid</Label>
                        {viewMode === "view" ? (
                          <p className="font-medium">₹{selectedUser.subscription.amountPaid}</p>
                        ) : (
                          <Input
                            type="number"
                            value={editFormData.amountPaid || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, amountPaid: parseFloat(e.target.value) })}
                            data-testid="input-edit-amount"
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Consultations Remaining</Label>
                        <p className="font-medium">{selectedUser.subscription.consultationsRemaining}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Start Date</Label>
                        {viewMode === "view" ? (
                          <p className="font-medium">
                            {format(new Date(selectedUser.subscription.subscriptionStartDate), "MMM d, yyyy")}
                          </p>
                        ) : (
                          <Input
                            type="date"
                            value={editFormData.subscriptionStartDate?.split("T")[0] || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, subscriptionStartDate: e.target.value })}
                            data-testid="input-edit-start-date"
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">End Date</Label>
                        {viewMode === "view" ? (
                          <p className="font-medium">
                            {format(new Date(selectedUser.subscription.subscriptionEndDate), "MMM d, yyyy")}
                          </p>
                        ) : (
                          <Input
                            type="date"
                            value={editFormData.subscriptionEndDate?.split("T")[0] || ""}
                            onChange={(e) => setEditFormData({ ...editFormData, subscriptionEndDate: e.target.value })}
                            data-testid="input-edit-end-date"
                          />
                        )}
                      </div>
                      {selectedUser.subscription.discountCoupon && (
                        <div>
                          <Label className="text-sm text-muted-foreground">Discount Coupon</Label>
                          <p className="font-medium">{selectedUser.subscription.discountCoupon}</p>
                        </div>
                      )}
                      {selectedUser.subscription.razorpayPaymentId && (
                        <div className="col-span-2">
                          <Label className="text-sm text-muted-foreground">Payment ID</Label>
                          <p className="font-medium text-sm">{selectedUser.subscription.razorpayPaymentId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            {viewMode === "edit" && (
              <Button onClick={handleSaveEdit} data-testid="button-save-edit">
                Save Changes
              </Button>
            )}
            <Button variant="outline" onClick={() => setViewMode(null)}>
              {viewMode === "view" ? "Close" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Consultations Dialog */}
      <Dialog open={consultationUpdateId !== null} onOpenChange={() => {
        setConsultationUpdateId(null);
        setCustomConsultations(0);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Consultations</DialogTitle>
            <DialogDescription>
              Choose a preset or enter a custom value
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preset Values</Label>
              <div className="grid grid-cols-3 gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => handleConsultationUpdate(consultationUpdateId!, 2)}
                        data-testid="button-set-consultations-2"
                        className="flex-1"
                      >
                        2 (Monthly)
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set consultations for Monthly plan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => handleConsultationUpdate(consultationUpdateId!, 18)}
                        data-testid="button-set-consultations-18"
                        className="flex-1"
                      >
                        18 (6-Month)
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set consultations for 6-Month plan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => handleConsultationUpdate(consultationUpdateId!, 48)}
                        data-testid="button-set-consultations-48"
                        className="flex-1"
                      >
                        48 (Annual)
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Set consultations for Annual plan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter custom value</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-consultations">Custom Number of Consultations</Label>
              <div className="flex gap-2">
                <Input
                  id="custom-consultations"
                  type="number"
                  min="0"
                  placeholder="Enter any number"
                  value={customConsultations || ''}
                  onChange={(e) => setCustomConsultations(parseInt(e.target.value) || 0)}
                  data-testid="input-custom-consultations"
                />
                <Button
                  onClick={() => handleConsultationUpdate(consultationUpdateId!, customConsultations)}
                  disabled={!customConsultations || customConsultations < 0}
                  data-testid="button-set-custom-consultations"
                >
                  Set
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Subscription Confirmation */}
      <AlertDialog open={deleteSubscriptionId !== null} onOpenChange={() => setDeleteSubscriptionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this subscription
              from the database. The user account will remain active.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteSubscriptionId && deleteSubscriptionMutation.mutate(deleteSubscriptionId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Account Confirmation */}
      <AlertDialog open={deleteUserPhone !== null} onOpenChange={() => setDeleteUserPhone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this user account
              and all associated bird details from the database. The user will need to create 
              a new account to login again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-user">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserPhone && deleteUserAccountMutation.mutate(deleteUserPhone)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete-user"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Metrics Dialog */}
      <Dialog open={showMetricsDialog} onOpenChange={setShowMetricsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Active Subscriptions Metric</DialogTitle>
            <DialogDescription>
              Set the active subscriptions count displayed on the subscription page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="metrics-value">Active Subscriptions Count</Label>
              <Input
                id="metrics-value"
                type="number"
                value={metricsValue}
                onChange={(e) => setMetricsValue(Number(e.target.value))}
                min={0}
                placeholder="Enter count"
                data-testid="input-metrics-value"
              />
            </div>
            <div>
              <Label htmlFor="metrics-reason">Reason for Change</Label>
              <Input
                id="metrics-reason"
                value={metricsReason}
                onChange={(e) => setMetricsReason(e.target.value)}
                placeholder="e.g., Manual correction, seasonal adjustment"
                data-testid="input-metrics-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMetricsDialog(false)}
              data-testid="button-cancel-metrics"
            >
              Cancel
            </Button>
            <Button
              onClick={() => updateMetricsMutation.mutate({ value: metricsValue, reason: metricsReason })}
              disabled={!metricsReason || updateMetricsMutation.isPending}
              data-testid="button-save-metrics"
            >
              {updateMetricsMutation.isPending ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
