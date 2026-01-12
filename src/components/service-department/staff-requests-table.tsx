"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useServiceDepartmentRequests, StaffRequest } from "@/hooks/use-staff-requests";
import { StaffRequestFormDialog } from "./staff-request-form-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  Eye,
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

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <Clock className="h-3 w-3" />,
  Approved: <CheckCircle2 className="h-3 w-3" />,
  Rejected: <XCircle className="h-3 w-3" />,
  Fulfilled: <CheckCircle2 className="h-3 w-3" />,
  Cancelled: <AlertCircle className="h-3 w-3" />,
};

export function StaffRequestsTable() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [editingRequest, setEditingRequest] = useState<StaffRequest | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<StaffRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<StaffRequest | null>(null);

  const { requests, stats, pagination, isLoading, refetch, cancelRequest, isCancelling } =
    useServiceDepartmentRequests({
      status: statusFilter,
      search: searchQuery,
      page,
      limit: 10,
    });

  const handleEditClick = (request: StaffRequest) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  };

  const handleCancelClick = (request: StaffRequest) => {
    setRequestToCancel(request);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (requestToCancel) {
      cancelRequest(requestToCancel.id);
      setCancelDialogOpen(false);
      setRequestToCancel(null);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingRequest(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-2xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">
                {stats.pending}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {stats.approved}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Fulfilled</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {stats.fulfilled}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-2xl text-red-600">
                {stats.rejected}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2 flex-1">
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button type="submit" variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Fulfilled">Fulfilled</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Staff Needed</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-8 w-8" />
                      <p>No staff requests found</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFormOpen(true)}
                      >
                        Create your first request
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request: StaffRequest) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.positionTitle}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {request.positionDescription}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{request.numberOfStaff}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={urgencyColors[request.urgency]}
                      >
                        {request.urgency}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={`${statusColors[request.status]} flex items-center gap-1 w-fit`}
                      >
                        {statusIcons[request.status]}
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {request.fulfilledCount} / {request.numberOfStaff}
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{
                              width: `${(request.fulfilledCount / request.numberOfStaff) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(request.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setViewingRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {request.status === "Pending" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(request)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Request
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleCancelClick(request)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Request
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <StaffRequestFormDialog
        open={isFormOpen}
        setOpen={handleFormClose}
        editingRequest={editingRequest}
        onSuccess={() => {
          refetch();
          setEditingRequest(null);
        }}
      />

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Staff Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the request for &quot;{requestToCancel?.positionTitle}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Keep Request
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Request"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Request Dialog */}
      <Dialog open={!!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Staff Request Details</DialogTitle>
            <DialogDescription>
              View the details of this staff request.
            </DialogDescription>
          </DialogHeader>

          {viewingRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`${statusColors[viewingRequest.status]} flex items-center gap-1`}
                >
                  {statusIcons[viewingRequest.status]}
                  {viewingRequest.status}
                </Badge>
                <Badge
                  variant="secondary"
                  className={urgencyColors[viewingRequest.urgency]}
                >
                  {viewingRequest.urgency} Priority
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position Title</p>
                  <p className="font-medium">{viewingRequest.positionTitle}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Position Description</p>
                  <p className="text-sm">{viewingRequest.positionDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Number of Staff</p>
                    <p>{viewingRequest.numberOfStaff}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Progress</p>
                    <p>{viewingRequest.fulfilledCount} / {viewingRequest.numberOfStaff} assigned</p>
                  </div>
                </div>

                {viewingRequest.preferredGender && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Preferred Gender</p>
                    <p>{viewingRequest.preferredGender === "MALE" ? "Male" : "Female"}</p>
                  </div>
                )}

                {viewingRequest.skillsRequired && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Skills Required</p>
                    <p className="text-sm">{viewingRequest.skillsRequired}</p>
                  </div>
                )}

                {viewingRequest.qualificationsRequired && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Qualifications Required</p>
                    <p className="text-sm">{viewingRequest.qualificationsRequired}</p>
                  </div>
                )}

                {viewingRequest.rejectionReason && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                    <p className="text-sm text-red-600">{viewingRequest.rejectionReason}</p>
                  </div>
                )}

                {viewingRequest.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm">{viewingRequest.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{format(new Date(viewingRequest.createdAt), "PPp")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm">{format(new Date(viewingRequest.updatedAt), "PPp")}</p>
                  </div>
                </div>

                {viewingRequest.approvedAt && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {viewingRequest.status === "Approved" || viewingRequest.status === "Fulfilled"
                        ? "Approved At"
                        : "Processed At"}
                    </p>
                    <p className="text-sm">{format(new Date(viewingRequest.approvedAt), "PPp")}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                {viewingRequest.status === "Pending" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setViewingRequest(null);
                      handleEditClick(viewingRequest);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Request
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setViewingRequest(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
