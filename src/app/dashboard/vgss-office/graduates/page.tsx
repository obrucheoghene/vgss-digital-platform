// src/app/dashboard/vgss-office/graduates/page.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Loader2,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  FileText,
  MessageSquare,
  BookOpen,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import {
  useVGSSGraduates,
  useGraduateDetail,
  useUpdateGraduateStatus,
  useApproveGraduate,
  useRejectGraduate,
} from "@/hooks/use-vgss-graduates";

export default function GraduateManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedGraduateId, setSelectedGraduateId] = useState<string | null>(
    null
  );
  const [selectedGraduates, setSelectedGraduates] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch graduates data
  const { data, isLoading, isError, refetch, isFetching } = useVGSSGraduates({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    status: selectedStatus,
    gender: selectedGender,
  });

  // Fetch selected graduate details
  const { data: graduateDetailData, isLoading: isLoadingDetail } =
    useGraduateDetail(selectedGraduateId);

  // Mutations
  const updateStatus = useUpdateGraduateStatus();
  const approveGraduate = useApproveGraduate();
  const rejectGraduate = useRejectGraduate();

  const graduates = data?.graduates || [];
  const stats = data?.stats || {
    total: 0,
    approved: 0,
    pending: 0,
    byStatus: {
      "Under Review": 0,
      "Invited For Interview": 0,
      Interviewed: 0,
      Sighting: 0,
      Serving: 0,
      "Not Accepted": 0,
    },
    byGender: { MALE: 0, FEMALE: 0 },
  };
  const pagination = data?.pagination;

  const selectedGraduate = graduateDetailData?.graduate;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Under Review": {
        className: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      "Invited For Interview": {
        className: "bg-blue-100 text-blue-800",
        icon: MessageSquare,
      },
      Interviewed: {
        className: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
      },
      Sighting: { className: "bg-orange-100 text-orange-800", icon: Eye },
      Serving: { className: "bg-green-100 text-green-800", icon: Star },
      "Not Accepted": { className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      className: "bg-gray-100 text-gray-800",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleStatusUpdate = async (graduateId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ graduateId, status: newStatus });
      toast.success(`Graduate status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleApproval = async (graduateId: string, approved: boolean) => {
    try {
      if (approved) {
        await approveGraduate.mutateAsync({ graduateId });
        toast.success("Graduate approved successfully");
      } else {
        await rejectGraduate.mutateAsync({ graduateId });
        toast.success("Graduate rejected");
      }
    } catch (error) {
      toast.error(`Failed to ${approved ? "approve" : "reject"} graduate`);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGraduates(graduates.map((grad) => grad.id));
    } else {
      setSelectedGraduates([]);
    }
  };

  const handleSelectGraduate = (graduateId: string, checked: boolean) => {
    if (checked) {
      setSelectedGraduates((prev) => [...prev, graduateId]);
    } else {
      setSelectedGraduates((prev) => prev.filter((id) => id !== graduateId));
    }
  };

  const handleViewDetails = (graduateId: string) => {
    setSelectedGraduateId(graduateId);
    setIsDetailModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  const handleGenderFilter = (value: string) => {
    setSelectedGender(value);
    setCurrentPage(1);
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.charAt(0) || ""}${surname?.charAt(0) || ""}`.toUpperCase();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalPages = pagination?.totalPages || 1;
  const isAllSelected =
    graduates.length > 0 && selectedGraduates.length === graduates.length;

  return (
    <DashboardLayout title="Graduate Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Graduate Management</h1>
            <p className="text-muted-foreground">
              Manage all registered graduates and their service status
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button onClick={() => refetch()} disabled={isFetching}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Graduates
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                  <p className="text-2xl font-bold">
                    {stats.byStatus["Under Review"]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Currently Serving
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.byStatus["Serving"]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Interviewed</p>
                  <p className="text-2xl font-bold">
                    {stats.byStatus["Interviewed"]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={handleStatusFilter}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="Under Review">
              Review ({stats.byStatus["Under Review"]})
            </TabsTrigger>
            <TabsTrigger value="Invited For Interview">
              Invited ({stats.byStatus["Invited For Interview"]})
            </TabsTrigger>
            <TabsTrigger value="Interviewed">
              Interviewed ({stats.byStatus["Interviewed"]})
            </TabsTrigger>
            <TabsTrigger value="Sighting">
              Sighting ({stats.byStatus["Sighting"]})
            </TabsTrigger>
            <TabsTrigger value="Serving">
              Serving ({stats.byStatus["Serving"]})
            </TabsTrigger>
            <TabsTrigger value="Not Accepted">
              Rejected ({stats.byStatus["Not Accepted"]})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Graduate List
                    </CardTitle>
                    <CardDescription>
                      Manage graduate registrations, approvals, and service
                      assignments
                    </CardDescription>
                  </div>

                  {/* Bulk Actions */}
                  {selectedGraduates.length > 0 && (
                    <div className="flex space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            Actions ({selectedGraduates.length})
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Bulk Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            Invite for Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem>Mark as Interviewed</DropdownMenuItem>
                          <DropdownMenuItem>Move to Sighting</DropdownMenuItem>
                          <DropdownMenuItem>Start Service</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Mark as Not Accepted
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search graduates
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, university, zone..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={selectedGender} onValueChange={handleGenderFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="MALE">
                        Male ({stats.byGender.MALE})
                      </SelectItem>
                      <SelectItem value="FEMALE">
                        Female ({stats.byGender.FEMALE})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Graduates Table */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Graduate</TableHead>
                        <TableHead>Education</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Approval</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading graduates...
                          </TableCell>
                        </TableRow>
                      ) : isError ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="text-muted-foreground">
                              Failed to load graduates
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
                      ) : graduates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No graduates found
                            </h3>
                            <p className="text-muted-foreground">
                              {searchQuery || selectedStatus !== "all"
                                ? "Try adjusting your search or filter criteria."
                                : "No graduates have registered yet."}
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        graduates.map((graduate) => {
                          const isSelected = selectedGraduates.includes(
                            graduate.id
                          );
                          return (
                            <TableRow
                              key={graduate.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleSelectGraduate(
                                      graduate.id,
                                      checked as boolean
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                      {getInitials(
                                        graduate.graduateFirstname,
                                        graduate.graduateSurname
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {graduate.graduateFirstname}{" "}
                                      {graduate.graduateSurname}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {graduate.email}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                      {graduate.graduateGender}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium text-sm">
                                    {graduate.nameOfUniversity || "N/A"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {graduate.courseOfStudy || "N/A"}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs">
                                    {graduate.graduationYear && (
                                      <Badge variant="outline" className="text-xs">
                                        {graduate.graduationYear}
                                      </Badge>
                                    )}
                                    {graduate.grade && (
                                      <Badge variant="outline" className="text-xs">
                                        {graduate.grade}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium text-sm">
                                    {graduate.nameOfZone || "N/A"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {graduate.nameOfChapterPastor || "N/A"}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(graduate.status)}
                              </TableCell>
                              <TableCell>
                                {graduate.isApproved ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Approved
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-orange-600"
                                  >
                                    <Clock className="w-3 h-3 mr-1" />
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>{formatDate(graduate.createdAt)}</p>
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
                                    <DropdownMenuLabel>
                                      Graduate Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleViewDetails(graduate.id)}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    {/* Status Updates */}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          graduate.id,
                                          "Invited For Interview"
                                        )
                                      }
                                    >
                                      Invite for Interview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(
                                          graduate.id,
                                          "Interviewed"
                                        )
                                      }
                                    >
                                      Mark as Interviewed
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(graduate.id, "Sighting")
                                      }
                                    >
                                      Move to Sighting
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStatusUpdate(graduate.id, "Serving")
                                      }
                                    >
                                      Start Service
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    {graduate.isApproved ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleApproval(graduate.id, false)
                                        }
                                        className="text-red-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Reject
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleApproval(graduate.id, true)
                                        }
                                        className="text-green-600"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Graduate
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination && totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing{" "}
                      {(pagination.page - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} graduates
                      {selectedGraduates.length > 0 && (
                        <span className="ml-2 font-medium">
                          ({selectedGraduates.length} selected)
                        </span>
                      )}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex space-x-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum =
                              currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                            if (pageNum > totalPages) return null;
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
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
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
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
          </TabsContent>
        </Tabs>

        {/* Graduate Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Graduate Profile
              </DialogTitle>
              <DialogDescription>
                Complete graduate information and service details
              </DialogDescription>
            </DialogHeader>

            {isLoadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2">Loading graduate details...</span>
              </div>
            ) : selectedGraduate ? (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Header with Photo */}
                  <div className="flex items-start gap-6">
                    <Avatar className="w-20 h-20">
                      {selectedGraduate.photo ? (
                        <AvatarImage src={selectedGraduate.photo} />
                      ) : null}
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {getInitials(
                          selectedGraduate.graduateFirstname,
                          selectedGraduate.graduateLastname || ""
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold">
                        {selectedGraduate.graduateFirstname}{" "}
                        {selectedGraduate.graduateLastname}
                      </h2>
                      <p className="text-muted-foreground">
                        {selectedGraduate.courseOfStudy} -{" "}
                        {selectedGraduate.nameOfUniversity}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {getStatusBadge(selectedGraduate.status)}
                        {selectedGraduate.isApproved ? (
                          <Badge className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            Pending Approval
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personal Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Personal Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Email
                          </Label>
                          <p className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {selectedGraduate.email}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Phone
                          </Label>
                          <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedGraduate.graduatePhoneNumber || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Gender
                          </Label>
                          <p>{selectedGraduate.graduateGender}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Marital Status
                          </Label>
                          <p>{selectedGraduate.maritalStatus || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Date of Birth
                          </Label>
                          <p>{formatDate(selectedGraduate.dateOfBirth)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            State of Origin
                          </Label>
                          <p className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {selectedGraduate.stateOfOrigin || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Education Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Education Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            University
                          </Label>
                          <p className="font-medium">
                            {selectedGraduate.nameOfUniversity || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Course of Study
                          </Label>
                          <p>{selectedGraduate.courseOfStudy || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Graduation Year
                          </Label>
                          <p className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {selectedGraduate.graduationYear || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Grade
                          </Label>
                          <Badge variant="outline">
                            {selectedGraduate.grade || "N/A"}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            NYSC Status
                          </Label>
                          <p>{selectedGraduate.nyscStatus || "N/A"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ministry Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        Ministry Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Zone
                          </Label>
                          <p className="font-medium">
                            {selectedGraduate.nameOfZone || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Chapter Pastor
                          </Label>
                          <p>{selectedGraduate.nameOfChapterPastor || "N/A"}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Preferred City of Posting
                          </Label>
                          <p>
                            {selectedGraduate.preferredCityOfPosting || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Questions */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Test Questions
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Vision, Mission & Purpose
                          </Label>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {selectedGraduate.visionMissionPurpose || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Why VGSS?
                          </Label>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {selectedGraduate.whyVgss || "N/A"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Plans After VGSS
                          </Label>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {selectedGraduate.plansAfterVgss || "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Information */}
                  {(selectedGraduate.serviceStartedDate ||
                    selectedGraduate.serviceCompletedDate) && (
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          Service Information
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          {selectedGraduate.serviceStartedDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Service Started
                              </Label>
                              <p>
                                {formatDate(selectedGraduate.serviceStartedDate)}
                              </p>
                            </div>
                          )}
                          {selectedGraduate.serviceCompletedDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Service Completed
                              </Label>
                              <p>
                                {formatDate(
                                  selectedGraduate.serviceCompletedDate
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailModalOpen(false)}
                    >
                      Close
                    </Button>
                    {!selectedGraduate.isApproved ? (
                      <Button
                        onClick={() => {
                          handleApproval(selectedGraduate.id, true);
                          setIsDetailModalOpen(false);
                        }}
                        disabled={approveGraduate.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {approveGraduate.isPending && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Graduate
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleApproval(selectedGraduate.id, false);
                          setIsDetailModalOpen(false);
                        }}
                        disabled={rejectGraduate.isPending}
                      >
                        {rejectGraduate.isPending && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    )}
                  </div>
                </div>
              </ScrollArea>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
