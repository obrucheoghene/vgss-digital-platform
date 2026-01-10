"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Loader2,
  GraduationCap,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { useAssignedStaff } from "@/hooks/use-assigned-staff";
import { StaffDetailModal } from "@/components/service-department/staff-detail-modal";

export default function MyVGSSStaffPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useAssignedStaff({
    page,
    limit: 10,
    search,
    status,
  });

  const staff = data?.staff || [];
  const stats = data?.stats;
  const pagination = data?.pagination;

  const getStatusBadge = (staffStatus: string) => {
    const statusConfig: Record<
      string,
      { className: string; icon: typeof Clock }
    > = {
      "Under Review": { className: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Invited For Interview": {
        className: "bg-blue-100 text-blue-800",
        icon: Calendar,
      },
      Interviewed: {
        className: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
      },
      Sighting: { className: "bg-orange-100 text-orange-800", icon: Clock },
      Serving: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      "Not Accepted": { className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[staffStatus] || {
      className: "bg-gray-100 text-gray-800",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {staffStatus}
      </Badge>
    );
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (staffId: string) => {
    setSelectedStaffId(staffId);
    setIsDetailModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <DashboardLayout title="My VGSS Staff">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My VGSS Staff</h1>
            <p className="text-muted-foreground">
              View and manage VGSS graduates assigned to your department
            </p>
          </div>
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
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Staff</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Currently Serving
                  </p>
                  <p className="text-2xl font-bold">{stats?.serving || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Male Staff</p>
                  <p className="text-2xl font-bold">{stats?.male || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Female Staff</p>
                  <p className="text-2xl font-bold">{stats?.female || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Staff Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Staff Directory
            </CardTitle>
            <CardDescription>
              All VGSS graduates currently assigned to your department
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, course, university..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={status} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Serving">Serving</SelectItem>
                  <SelectItem value="Sighting">Sighting</SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Education</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Service Started</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                        <p className="text-muted-foreground">Loading staff...</p>
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
                        <p className="text-muted-foreground">
                          Failed to load staff. Please try again.
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
                  ) : staff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">
                          No staff assigned yet
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                          {search || status !== "all"
                            ? "No staff match your search criteria. Try adjusting your filters."
                            : "You don't have any VGSS staff assigned to your department yet. Submit a staff request to get started."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    staff.map((member) => (
                      <TableRow key={member.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              {member.photo ? (
                                <AvatarImage
                                  src={member.photo}
                                  alt={member.graduateFirstname}
                                />
                              ) : null}
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {getInitials(
                                  member.graduateFirstname,
                                  member.graduateSurname
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.graduateFirstname} {member.graduateSurname}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{member.graduateGender}</span>
                                {member.stateOfOrigin && (
                                  <>
                                    <span>•</span>
                                    <span>{member.stateOfOrigin}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {member.courseOfStudy || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.nameOfUniversity || "N/A"}
                            </p>
                            {member.graduationYear && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Class of {member.graduationYear}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="flex items-center text-sm text-blue-600 hover:underline"
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Email
                              </a>
                            )}
                            {member.graduatePhoneNumber && (
                              <a
                                href={`tel:${member.graduatePhoneNumber}`}
                                className="flex items-center text-sm text-green-600 hover:underline"
                              >
                                <Phone className="w-3 h-3 mr-1" />
                                {member.graduatePhoneNumber}
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDate(member.serviceStartedDate)}
                          </p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(member.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} staff
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.totalPages) },
                      (_, i) => {
                        const pageNum =
                          page <= 3 ? i + 1 : page - 2 + i;
                        if (pageNum > pagination.totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className="w-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(pagination.totalPages, prev + 1)
                      )
                    }
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staff Detail Modal */}
        <StaffDetailModal
          staffId={selectedStaffId}
          open={isDetailModalOpen}
          onOpenChange={setIsDetailModalOpen}
        />
      </div>
    </DashboardLayout>
  );
}
