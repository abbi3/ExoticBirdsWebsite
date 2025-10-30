import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, Eye, Edit2, Ban } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";

export default function AdminAppointments() {
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showBlockSlotDialog, setShowBlockSlotDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [blockDate, setBlockDate] = useState<Date | undefined>(undefined);
  const [blockTime, setBlockTime] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const { toast } = useToast();

  // Fetch all appointments
  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (filterDate) params.append("date", filterDate);
    if (filterStatus && filterStatus !== "all") params.append("status", filterStatus);
    if (filterPlan && filterPlan !== "all") params.append("plan", filterPlan);
    const queryString = params.toString();
    return queryString ? `/api/admin/appointments?${queryString}` : "/api/admin/appointments";
  };

  const { data: appointments, isLoading: loadingAppointments } = useQuery<any[]>({
    queryKey: ["/api/admin/appointments", filterDate, filterStatus, filterPlan],
    queryFn: async () => {
      const response = await fetch(buildQueryString());
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
  });

  // Fetch blocked slots
  const { data: blockedSlots } = useQuery<any[]>({
    queryKey: ["/api/admin/blocked-slots"],
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { status?: string; adminNotes?: string };
    }) => {
      return await apiRequest("PATCH", `/api/admin/appointments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/appointments"] });
      setShowDetailsDialog(false);
      toast({
        title: "Appointment Updated",
        description: "Appointment has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update appointment",
        variant: "destructive",
      });
    },
  });

  const blockSlotMutation = useMutation({
    mutationFn: async (data: {
      blockDate: string;
      slotStartTime?: string;
      reason: string;
    }) => {
      return await apiRequest("POST", "/api/admin/blocked-slots", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blocked-slots"] });
      setShowBlockSlotDialog(false);
      setBlockDate(undefined);
      setBlockTime("");
      setBlockReason("");
      toast({
        title: "Slot Blocked",
        description: "Time slot has been blocked successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Block Slot",
        description: error.message || "Failed to block time slot",
        variant: "destructive",
      });
    },
  });

  const deleteBlockedSlotMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/blocked-slots/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blocked-slots"] });
      toast({
        title: "Slot Unblocked",
        description: "Time slot has been unblocked successfully",
      });
    },
  });

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setAdminNotes(appointment.adminNotes || "");
    setShowDetailsDialog(true);
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedAppointment) return;
    updateAppointmentMutation.mutate({
      id: selectedAppointment.id,
      data: { status },
    });
  };

  const handleSaveNotes = () => {
    if (!selectedAppointment) return;
    updateAppointmentMutation.mutate({
      id: selectedAppointment.id,
      data: { adminNotes },
    });
  };

  const handleBlockSlot = () => {
    if (!blockDate) {
      toast({
        title: "Missing Information",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    blockSlotMutation.mutate({
      blockDate: format(blockDate, "yyyy-MM-dd"),
      slotStartTime: blockTime || undefined,
      reason: blockReason,
    });
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: <Badge className="bg-blue-500">Scheduled</Badge>,
      completed: <Badge className="bg-green-500">Completed</Badge>,
      canceled: <Badge variant="destructive">Canceled</Badge>,
    };
    return badges[status as keyof typeof badges] || <Badge>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Appointment Management
              </CardTitle>
              <CardDescription>View and manage all consultation appointments</CardDescription>
            </div>
            <Button onClick={() => setShowBlockSlotDialog(true)} data-testid="button-block-slot">
              <Ban className="h-4 w-4 mr-2" />
              Block Slot
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              placeholder="Filter by date"
              data-testid="input-filter-date"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger data-testid="select-filter-status">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPlan} onValueChange={setFilterPlan}>
              <SelectTrigger data-testid="select-filter-plan">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="six-month">6-Month</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setFilterDate("");
                setFilterStatus("all");
                setFilterPlan("all");
              }}
              data-testid="button-clear-filters"
            >
              Clear Filters
            </Button>
          </div>

          {loadingAppointments ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Bird</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((apt: any) => (
                    <TableRow key={apt.id} data-testid={`row-appointment-${apt.id}`}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(apt.appointmentDate), "MMM d, yyyy")}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {apt.slotStartTime} - {apt.slotEndTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{apt.fullName}</span>
                          <span className="text-sm text-muted-foreground">{apt.userPhone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{apt.birdName}</TableCell>
                      <TableCell>
                        {apt.subscriptionPlan ? (
                          <Badge variant="outline">
                            {apt.subscriptionPlan === "monthly"
                              ? "Monthly"
                              : apt.subscriptionPlan === "six-month"
                              ? "6-Month"
                              : "Annual"}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(apt)}
                          data-testid={`button-view-${apt.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No appointments found</p>
          )}
        </CardContent>
      </Card>

      {/* Blocked Slots Section */}
      {blockedSlots && blockedSlots.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5" />
              Blocked Time Slots
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {blockedSlots.map((slot: any) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  data-testid={`blocked-slot-${slot.id}`}
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(slot.blockDate), "MMM d, yyyy")}
                      {slot.slotStartTime && ` - ${slot.slotStartTime}`}
                    </p>
                    {slot.reason && (
                      <p className="text-sm text-muted-foreground">{slot.reason}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBlockedSlotMutation.mutate(slot.id)}
                    data-testid={`button-unblock-${slot.id}`}
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appointment Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl" data-testid="dialog-appointment-details">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient</p>
                  <p className="font-semibold">{selectedAppointment.fullName}</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.userPhone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Bird</p>
                  <p className="font-semibold">{selectedAppointment.birdName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">
                    {format(new Date(selectedAppointment.appointmentDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm">
                    {selectedAppointment.slotStartTime} - {selectedAppointment.slotEndTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
              </div>

              {selectedAppointment.symptoms && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Symptoms</p>
                  <p className="text-sm border rounded-lg p-3">{selectedAppointment.symptoms}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this appointment..."
                  data-testid="textarea-admin-notes"
                />
              </div>

              <div className="flex gap-2">
                {selectedAppointment.status === "scheduled" && (
                  <>
                    <Button
                      onClick={() => handleUpdateStatus("completed")}
                      className="flex-1"
                      data-testid="button-mark-completed"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Completed
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus("canceled")}
                      className="flex-1"
                      data-testid="button-cancel-appointment"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  onClick={handleSaveNotes}
                  disabled={adminNotes === selectedAppointment.adminNotes}
                  data-testid="button-save-notes"
                >
                  Save Notes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Block Slot Dialog */}
      <Dialog open={showBlockSlotDialog} onOpenChange={setShowBlockSlotDialog}>
        <DialogContent data-testid="dialog-block-slot">
          <DialogHeader>
            <DialogTitle>Block Time Slot</DialogTitle>
            <DialogDescription>
              Block a specific time slot or entire day to prevent bookings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Calendar
                mode="single"
                selected={blockDate}
                onSelect={setBlockDate}
                className="rounded-md border"
                data-testid="calendar-block-date"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Time Slot (leave empty to block entire day)
              </label>
              <Input
                type="time"
                value={blockTime}
                onChange={(e) => setBlockTime(e.target.value)}
                data-testid="input-block-time"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Reason</label>
              <Input
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g., Holiday, Personal leave"
                data-testid="input-block-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBlockSlotDialog(false)}
              data-testid="button-cancel-block"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBlockSlot}
              disabled={!blockDate || blockSlotMutation.isPending}
              data-testid="button-confirm-block"
            >
              {blockSlotMutation.isPending ? "Blocking..." : "Block Slot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
