"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useStaffRequest,
  useStaffRequestActions,
  StaffRequest,
} from "@/hooks/use-staff-requests";
import { AssignGraduateModal } from "./assign-graduate-modal";
import {
  CheckCircle,
  XCircle,
  UserPlus,
  Clock,
  Building2,
  User,
  Briefcase,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Fulfilled: "bg-green-100 text-green-800",
  Cancelled: "bg-gray-100 text-gray-800",
};

const urgencyColors: Record<string, string> = {
  Low: "bg-slate-100 text-slate-800",
  Medium: "bg-blue-100 text-blue-800",
  High: "bg-orange-100 text-orange-800",
  Urgent: "bg-red-100 text-red-800",
};

interface StaffRequestDetailModalProps {
  request: StaffRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionComplete?: () => void;
}

export function StaffRequestDetailModal({
  request,
  open,
  onOpenChange,
  onActionComplete,
}: StaffRequestDetailModalProps) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const { data: detailData, isLoading } = useStaffRequest(
    open && request?.id ? request.id : undefined
  );
  const { mutate: performAction, isPending: isPerformingAction } =
    useStaffRequestActions();

  const detailedRequest = detailData?.request || request;
  const assignments = detailData?.assignments || [];

  const handleApprove = () => {
    if (!request?.id) return;
    performAction(
      { requestId: request.id, action: "approve", data: { notes } },
      {
        onSuccess: () => {
          onActionComplete?.();
        },
      }
    );
  };

  const handleReject = () => {
    if (!request?.id || !rejectionReason.trim()) return;
    performAction(
      { requestId: request.id, action: "reject", data: { rejectionReason } },
      {
        onSuccess: () => {
          setRejectionReason("");
          onActionComplete?.();
        },
      }
    );
  };

  const handleAddNotes = () => {
    if (!request?.id || !notes.trim()) return;
    performAction(
      { requestId: request.id, action: "add_notes", data: { notes } },
      {
        onSuccess: () => {
          setNotes("");
        },
      }
    );
  };

  if (!request) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {detailedRequest?.positionTitle || "Staff Request"}
            </DialogTitle>
            <DialogDescription>
              Review and manage this staff request
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="assigned">
                Assigned ({assignments.length})
              </TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <>
                  {/* Status and Department */}
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className={statusColors[detailedRequest?.status || "Pending"]}
                    >
                      {detailedRequest?.status}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={urgencyColors[detailedRequest?.urgency || "Medium"]}
                    >
                      {detailedRequest?.urgency} Urgency
                    </Badge>
                  </div>

                  {/* Department Info */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Requesting Department
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">
                        {detailedRequest?.departmentName || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {detailedRequest?.departmentEmail}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Position Details */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Position Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          Description
                        </Label>
                        <p className="text-sm">
                          {detailedRequest?.positionDescription}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Staff Needed
                          </Label>
                          <p className="text-sm font-medium">
                            {detailedRequest?.numberOfStaff}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Gender Preference
                          </Label>
                          <p className="text-sm font-medium">
                            {detailedRequest?.preferredGender || "No preference"}
                          </p>
                        </div>
                      </div>
                      {detailedRequest?.skillsRequired && (
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Skills Required
                          </Label>
                          <p className="text-sm">{detailedRequest.skillsRequired}</p>
                        </div>
                      )}
                      {detailedRequest?.qualificationsRequired && (
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Qualifications Required
                          </Label>
                          <p className="text-sm">
                            {detailedRequest.qualificationsRequired}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Progress */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Fulfillment Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{
                                width: `${((detailedRequest?.fulfilledCount || 0) / (detailedRequest?.numberOfStaff || 1)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {detailedRequest?.fulfilledCount} /{" "}
                          {detailedRequest?.numberOfStaff}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span>
                          {detailedRequest?.createdAt
                            ? format(
                                new Date(detailedRequest.createdAt),
                                "MMM d, yyyy 'at' h:mm a"
                              )
                            : "-"}
                        </span>
                      </div>
                      {detailedRequest?.approvedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {detailedRequest.status === "Rejected"
                              ? "Rejected"
                              : "Approved"}
                          </span>
                          <span>
                            {format(
                              new Date(detailedRequest.approvedAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>
                      )}
                      {detailedRequest?.fulfilledAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fulfilled</span>
                          <span>
                            {format(
                              new Date(detailedRequest.fulfilledAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Rejection Reason */}
                  {detailedRequest?.rejectionReason && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-red-800 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4" />
                          Rejection Reason
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-red-700">
                          {detailedRequest.rejectionReason}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Notes */}
                  {detailedRequest?.notes && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Admin Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{detailedRequest.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="assigned" className="space-y-4 mt-4">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <User className="h-8 w-8 mx-auto mb-2" />
                  <p>No graduates assigned yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              {assignment.graduateFirstname}{" "}
                              {assignment.graduateSurname}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {assignment.graduateEmail}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Assigned{" "}
                              {format(
                                new Date(assignment.assignedAt),
                                "MMM d, yyyy"
                              )}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {assignment.graduateGender}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {detailedRequest?.status === "Approved" &&
                (detailedRequest?.fulfilledCount || 0) <
                  (detailedRequest?.numberOfStaff || 1) && (
                  <Button
                    className="w-full"
                    onClick={() => setIsAssignModalOpen(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Graduate
                  </Button>
                )}
            </TabsContent>

            <TabsContent value="actions" className="space-y-4 mt-4">
              {detailedRequest?.status === "Pending" && (
                <>
                  {/* Approve */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Approve Request
                      </CardTitle>
                      <CardDescription>
                        Approve this request to allow graduate assignment
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="approveNotes">Notes (optional)</Label>
                        <Textarea
                          id="approveNotes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes..."
                          rows={2}
                        />
                      </div>
                      <Button
                        onClick={handleApprove}
                        disabled={isPerformingAction}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isPerformingAction ? "Processing..." : "Approve Request"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Reject */}
                  <Card className="border-red-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-700 flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Reject Request
                      </CardTitle>
                      <CardDescription>
                        Reject this request with a reason
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="rejectionReason">
                          Rejection Reason *
                        </Label>
                        <Textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide a reason for rejection..."
                          rows={3}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isPerformingAction || !rejectionReason.trim()}
                      >
                        {isPerformingAction ? "Processing..." : "Reject Request"}
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}

              {detailedRequest?.status === "Approved" && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Assign Graduates
                    </CardTitle>
                    <CardDescription>
                      Assign available graduates to this position
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setIsAssignModalOpen(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Graduate
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Add Notes - Always available */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Add/Update Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={3}
                  />
                  <Button
                    variant="outline"
                    onClick={handleAddNotes}
                    disabled={isPerformingAction || !notes.trim()}
                  >
                    Save Notes
                  </Button>
                </CardContent>
              </Card>

              {(detailedRequest?.status === "Fulfilled" ||
                detailedRequest?.status === "Rejected" ||
                detailedRequest?.status === "Cancelled") && (
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2" />
                  <p>This request has been {detailedRequest.status.toLowerCase()}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Graduate Modal */}
      {request && (
        <AssignGraduateModal
          requestId={request.id}
          open={isAssignModalOpen}
          onOpenChange={setIsAssignModalOpen}
          onAssigned={() => {
            setIsAssignModalOpen(false);
            onActionComplete?.();
          }}
        />
      )}
    </>
  );
}
