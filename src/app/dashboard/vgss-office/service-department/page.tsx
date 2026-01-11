// src/app/dashboard/vgss-office/service-department/page.tsx
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Building,
  Search,
  MoreHorizontal,
  Eye,
  UserPlus,
  Users,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2,
  Mail,
  Calendar,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  useServiceDepartments,
  useToggleDepartmentStatus,
  ServiceDepartment,
} from "@/hooks/use-service-departments";

export default function ServiceDepartmentManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] =
    useState<ServiceDepartment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Fetch data
  const { data, isLoading, isError, refetch, isFetching } =
    useServiceDepartments();
  const toggleStatus = useToggleDepartmentStatus();

  const departments = data?.results || [];

  // Calculate stats
  const stats = useMemo(() => {
    const total = departments.length;
    const active = departments.filter(
      (d) => d.accountStatus === "active" && !d.isDeactivated
    ).length;
    const pending = departments.filter(
      (d) => d.accountStatus === "pending_activation"
    ).length;
    const deactivated = departments.filter((d) => d.isDeactivated).length;
    const totalStaff = departments.reduce((sum, d) => sum + d.staffCounts, 0);

    return { total, active, pending, deactivated, totalStaff };
  }, [departments]);

  // Filter departments
  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchesSearch =
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" &&
          dept.accountStatus === "active" &&
          !dept.isDeactivated) ||
        (selectedStatus === "pending" &&
          dept.accountStatus === "pending_activation") ||
        (selectedStatus === "deactivated" && dept.isDeactivated);

      return matchesSearch && matchesStatus;
    });
  }, [departments, searchQuery, selectedStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDepartments = filteredDepartments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (dept: ServiceDepartment) => {
    if (dept.isDeactivated) {
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Deactivated
        </Badge>
      );
    }

    if (dept.accountStatus === "pending_activation") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  const handleToggleStatus = async (dept: ServiceDepartment) => {
    try {
      await toggleStatus.mutateAsync({
        departmentId: dept.id,
        isDeactivated: !dept.isDeactivated,
      });
      toast.success(
        `Department ${dept.isDeactivated ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error("Failed to update department status");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  return (
    <DashboardLayout title="Service Department Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Service Department Management</h1>
            <p className="text-muted-foreground">
              Manage Service Departments and monitor staff assignments
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/dashboard/vgss-office/create-account">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Department
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Departments
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Assigned Staff
                  </p>
                  <p className="text-2xl font-bold">{stats.totalStaff}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Service Department Directory
            </CardTitle>
            <CardDescription>
              All registered Service Departments and their staff assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Label htmlFor="search" className="sr-only">
                  Search departments
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="active">Active ({stats.active})</SelectItem>
                  <SelectItem value="pending">Pending ({stats.pending})</SelectItem>
                  <SelectItem value="deactivated">
                    Deactivated ({stats.deactivated})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Staff</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Loading departments...
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <p className="text-muted-foreground">
                          Failed to load departments
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => refetch()}
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : paginatedDepartments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No departments found
                        </h3>
                        <p className="text-muted-foreground">
                          {searchQuery || selectedStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No Service Departments have been created yet."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDepartments.map((dept) => (
                      <TableRow key={dept.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <Building className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{dept.name}</p>
                              <p className="text-sm text-muted-foreground flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {dept.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dept)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{dept.staffCounts}</span>
                            <span className="text-muted-foreground text-sm">
                              staff
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {dept.lastLoginAt ? (
                              <>
                                <p>{formatDate(dept.lastLoginAt)}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(dept.lastLoginAt).toLocaleTimeString()}
                                </p>
                              </>
                            ) : (
                              <span className="text-muted-foreground">Never</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(dept.createdAt)}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedDepartment(dept);
                                  setIsDetailModalOpen(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className={
                                      dept.isDeactivated
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }
                                  >
                                    {dept.isDeactivated ? (
                                      <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Activate
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Deactivate
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {dept.isDeactivated
                                        ? "Activate Department"
                                        : "Deactivate Department"}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to{" "}
                                      {dept.isDeactivated
                                        ? "activate"
                                        : "deactivate"}{" "}
                                      {dept.name}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleToggleStatus(dept)}
                                    >
                                      {dept.isDeactivated
                                        ? "Activate"
                                        : "Deactivate"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + itemsPerPage, filteredDepartments.length)}{" "}
                  of {filteredDepartments.length} departments
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Department Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Department Details
              </DialogTitle>
              <DialogDescription>
                Service Department information and statistics
              </DialogDescription>
            </DialogHeader>

            {selectedDepartment && (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Department Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Name
                          </Label>
                          <p className="font-medium">{selectedDepartment.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Email
                          </Label>
                          <p className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {selectedDepartment.email}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Status
                          </Label>
                          <div className="mt-1">
                            {getStatusBadge(selectedDepartment)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Created
                          </Label>
                          <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(selectedDepartment.createdAt)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Staff Statistics */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Staff Overview
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedDepartment.staffCounts}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Assigned Staff
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedDepartment.lastLoginAt ? "Active" : "Inactive"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Login Status
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Activity */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Activity</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Last Login
                          </Label>
                          <p>
                            {selectedDepartment.lastLoginAt
                              ? new Date(
                                  selectedDepartment.lastLoginAt
                                ).toLocaleString()
                              : "Never logged in"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Last Updated
                          </Label>
                          <p>
                            {new Date(
                              selectedDepartment.updatedAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailModalOpen(false)}
                    >
                      Close
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={
                            selectedDepartment.isDeactivated
                              ? "default"
                              : "destructive"
                          }
                          className={
                            selectedDepartment.isDeactivated
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          {selectedDepartment.isDeactivated ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {selectedDepartment.isDeactivated
                              ? "Activate Department"
                              : "Deactivate Department"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {selectedDepartment.isDeactivated
                              ? "activate"
                              : "deactivate"}{" "}
                            {selectedDepartment.name}?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              handleToggleStatus(selectedDepartment);
                              setIsDetailModalOpen(false);
                            }}
                          >
                            {selectedDepartment.isDeactivated
                              ? "Activate"
                              : "Deactivate"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
