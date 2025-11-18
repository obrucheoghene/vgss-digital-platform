"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import {
  GraduationCap,
  Search,
  Filter,
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
  Users,
  Award,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface Graduate {
  id: string;
  userId: string;
  graduateFirstname: string;
  graduateSurname: string;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string;
  graduateEmail: string;
  maritalStatus: "SINGLE" | "MARRIED";
  dateOfBirth: string;
  stateOfOrigin: string;
  nameOfZone: string;
  nameOfFellowship: string;
  nameOfChapterPastor: string;
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: number;
  grade: string;
  nyscStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED";
  preferredCityOfPosting?: string;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  serviceStartedDate?: string;
  serviceCompletedDate?: string;
  createdAt: string;
  updatedAt: string;
  registeredAt: string;
  // Test questions preview
  visionMissionPurpose?: string;
  whyVgss?: string;
  plansAfterVgss?: string;
  chapter: string;
}

interface GraduateStats {
  total: number;
  underReview: number;
  interviewed: number;
  serving: number;
  completed: number;
  notAccepted: number;
  byGender: {
    MALE: number;
    FEMALE: number;
  };
  byStatus: {
    "Under Review": number;
    "Invited For Interview": number;
    Interviewed: number;
    Sighting: number;
    Serving: number;
    "Not Accepted": number;
  };
}

export default function GraduateManagementPage() {
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [filteredGraduates, setFilteredGraduates] = useState<Graduate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedGraduate, setSelectedGraduate] = useState<Graduate | null>(
    null
  );
  const [selectedGraduates, setSelectedGraduates] = useState<string[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [allGraduates, setAllGraduates] = useState<Graduate[]>([]);
  const [registeredGraduates, setRegisteredGraduate] = useState<Graduate[]>([]);

  useEffect(() => {
    const fetchGraduates = async () => {
      try {
        setIsLoading(true);

        const response = await fetch("/api/blw-zone/graduates");
        const data = await response.json();
        console.log(data);
        if (data && data.success) {
          setAllGraduates(data.results.uploadedGraudates);
          // setAllGraduates(data.results.registeredGraduates);
        }
        setIsLoading(false);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGraduates();
  }, []);

  // Mock stats - replace with real data
  const [stats, setStats] = useState<GraduateStats>({
    total: 0,
    underReview: 0,
    interviewed: 0,
    serving: 0,
    completed: 0,
    notAccepted: 0,
    byGender: { MALE: 0, FEMALE: 0 },
    byStatus: {
      "Under Review": 0,
      "Invited For Interview": 0,
      Interviewed: 0,
      Sighting: 0,
      Serving: 0,
      "Not Accepted": 0,
    },
  });

  // Mock data - replace with API call

  // Filter graduates based on search and filters
  useEffect(() => {
    let filtered = allGraduates;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (graduate) =>
          graduate.graduateFirstname
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          graduate.graduateSurname
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          graduate.graduateEmail
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          graduate.nameOfUniversity
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          graduate.courseOfStudy
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          graduate.nameOfZone
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          graduate.nameOfFellowship
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }
    console.log({ filtered });
    // Status filter
    // if (selectedStatus !== "all") {
    //   filtered = filtered.filter(
    //     (graduate) => graduate.status === selectedStatus
    //   );
    // }

    // // Gender filter
    // if (selectedGender !== "all") {
    //   filtered = filtered.filter(
    //     (graduate) => graduate.graduateGender === selectedGender
    //   );
    // }

    setFilteredGraduates(filtered);
    setCurrentPage(1); // Reset to first page when filters change
    setSelectedGraduates([]); // Clear selections
  }, [allGraduates, searchQuery, selectedStatus, selectedGender]);

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
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setGraduates((prev) =>
        prev.map((grad) =>
          grad.id === graduateId
            ? {
                ...grad,
                status: newStatus as Graduate["status"],
                updatedAt: new Date().toISOString(),
              }
            : grad
        )
      );

      toast.success(`Graduate status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleApproval = async (graduateId: string, approved: boolean) => {
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setGraduates((prev) =>
        prev.map((grad) =>
          grad.id === graduateId
            ? {
                ...grad,
                isApproved: approved,
                approvedBy: approved ? "current-admin" : undefined,
                approvedAt: approved ? new Date().toISOString() : undefined,
                updatedAt: new Date().toISOString(),
              }
            : grad
        )
      );

      toast.success(
        `Graduate ${approved ? "approved" : "approval revoked"} successfully`
      );
    } catch (error) {
      toast.error(`Failed to ${approved ? "approve" : "revoke approval"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedGraduates.length === 0) return;

    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setGraduates((prev) =>
        prev.map((grad) =>
          selectedGraduates.includes(grad.id)
            ? {
                ...grad,
                status: status as Graduate["status"],
                updatedAt: new Date().toISOString(),
              }
            : grad
        )
      );

      setSelectedGraduates([]);
      toast.success(
        `${selectedGraduates.length} graduates updated to ${status}`
      );
    } catch (error) {
      toast.error("Failed to update graduates");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGraduates(paginatedGraduates.map((grad) => grad.id));
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

  // Pagination
  const totalPages = Math.ceil(filteredGraduates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGraduates = filteredGraduates.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const isAllSelected =
    paginatedGraduates.length > 0 &&
    selectedGraduates.length === paginatedGraduates.length;
  const isSomeSelected =
    selectedGraduates.length > 0 &&
    selectedGraduates.length < paginatedGraduates.length;

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
            <Button
              onClick={() => window.location.reload()}
              disabled={isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All ({allGraduates.length})</TabsTrigger>
            <TabsTrigger value="Register">
              Registered ({stats.byStatus["Under Review"]})
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
                    {/* <CardDescription>
                      Manage graduate registrations, approvals, and service
                      assignments
                    </CardDescription> */}
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
                          <DropdownMenuItem
                            onClick={() =>
                              handleBulkStatusUpdate("Invited For Interview")
                            }
                          >
                            Invite for Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleBulkStatusUpdate("Interviewed")
                            }
                          >
                            Mark as Interviewed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkStatusUpdate("Sighting")}
                          >
                            Move to Sighting
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBulkStatusUpdate("Serving")}
                          >
                            Start Service
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() =>
                              handleBulkStatusUpdate("Not Accepted")
                            }
                          >
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
                        placeholder="Search by name, email, university, course, zone, or fellowship..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select
                    value={selectedGender}
                    onValueChange={setSelectedGender}
                  >
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
                            ref={(ref) => {
                              // if (ref) ref.indeterminate = isSomeSelected;
                            }}
                          />
                        </TableHead>
                        <TableHead>Graduate</TableHead>
                        <TableHead>Education</TableHead>
                        <TableHead>Ministry Info</TableHead>
                        {/* <TableHead>Status</TableHead>
                        <TableHead>Approval</TableHead> */}
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
                      ) : paginatedGraduates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No graduates found
                            </h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filter criteria.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedGraduates.map((graduate) => {
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
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {`${graduate.graduateFirstname} ${graduate.graduateSurname}`}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {graduate.graduatePhoneNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>{graduate.graduateGender}</span>
                                    {/* <span>•</span>
                                    <span>{graduate.maritalStatus}</span>
                                    <span>•</span>
                                    <span>{graduate.stateOfOrigin}</span> */}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium text-sm">
                                    {graduate.nameOfUniversity}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {graduate.courseOfStudy}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {graduate.graduationYear}
                                    </Badge>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium text-sm">
                                    {graduate.nameOfZone}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {graduate.chapter}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {graduate.nameOfChapterPastor}
                                  </p>
                                </div>
                              </TableCell>
                              {/* <TableCell>
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
                              </TableCell> */}
                              <TableCell>
                                {graduate.registeredAt ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Registed
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="text-orange-600"
                                  >
                                    <Clock className="w-3 h-3 mr-1" />
                                    Not Registered
                                  </Badge>
                                )}
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
                                      onClick={() => {
                                        setSelectedGraduate(graduate);
                                        setIsDetailModalOpen(true);
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Information
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    {/* Status Update Submenu */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="flex items-center w-full px-2 py-1.5 text-sm rounded hover:bg-accent">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Update Status
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent side="left">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              graduate.id,
                                              "Under Review"
                                            )
                                          }
                                        >
                                          Under Review
                                        </DropdownMenuItem>
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
                                          Interviewed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              graduate.id,
                                              "Sighting"
                                            )
                                          }
                                        >
                                          Sighting
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              graduate.id,
                                              "Serving"
                                            )
                                          }
                                        >
                                          Start Service
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          className="text-red-600"
                                          onClick={() =>
                                            handleStatusUpdate(
                                              graduate.id,
                                              "Not Accepted"
                                            )
                                          }
                                        >
                                          Not Accepted
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>

                                    <DropdownMenuSeparator />
                                    {graduate.isApproved ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleApproval(graduate.id, false)
                                        }
                                        className="text-red-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Revoke Approval
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
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredGraduates.length
                      )}{" "}
                      of {filteredGraduates.length} graduates
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
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
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
                Graduate Profile: {selectedGraduate?.graduateFirstname}
              </DialogTitle>
              <DialogDescription>
                Complete graduate information and service details
              </DialogDescription>
            </DialogHeader>

            {selectedGraduate && (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Status and Approval Section */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Current Status
                        </h3>
                        <div className="space-y-2">
                          {getStatusBadge(selectedGraduate.status)}
                          <div className="text-sm text-muted-foreground">
                            Last updated:{" "}
                            {new Date(
                              selectedGraduate.updatedAt
                            ).toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approval Status
                        </h3>
                        <div className="space-y-2">
                          {selectedGraduate.isApproved ? (
                            <div>
                              <Badge className="bg-green-100 text-green-800 mb-2">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approved
                              </Badge>
                              {selectedGraduate.approvedAt && (
                                <p className="text-sm text-muted-foreground">
                                  Approved on{" "}
                                  {new Date(
                                    selectedGraduate.approvedAt
                                  ).toLocaleString()}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-orange-600"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              Pending Approval
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Personal Information */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Personal Information
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Full Name
                            </Label>
                            <p className="font-medium">
                              {`${selectedGraduate.graduateFirstname} ${selectedGraduate.graduateSurname}`}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Email
                            </Label>
                            <p className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {selectedGraduate.graduateEmail}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Phone
                            </Label>
                            <p className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              {selectedGraduate.graduatePhoneNumber}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
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
                            <p>{selectedGraduate.maritalStatus}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              State of Origin
                            </Label>
                            <p className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {selectedGraduate.stateOfOrigin}
                            </p>
                          </div>
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
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              University
                            </Label>
                            <p className="font-medium">
                              {selectedGraduate.nameOfUniversity}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Course of Study
                            </Label>
                            <p>{selectedGraduate.courseOfStudy}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Graduation Year
                            </Label>
                            <p className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {selectedGraduate.graduationYear}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Grade
                            </Label>
                            <Badge variant="outline">
                              {selectedGraduate.grade}
                            </Badge>
                          </div>
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
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Zone
                            </Label>
                            <p className="font-medium">
                              {selectedGraduate.nameOfZone}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Fellowship
                            </Label>
                            <p>{selectedGraduate.nameOfFellowship}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Chapter Pastor
                            </Label>
                            <p>{selectedGraduate.nameOfChapterPastor}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Preferred Posting
                            </Label>
                            <p>
                              {selectedGraduate.preferredCityOfPosting ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Test Questions Preview */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Test Questions Preview
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Vision, Mission & Purpose
                          </Label>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {selectedGraduate.visionMissionPurpose ||
                              "No response"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Why VGSS?
                          </Label>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {selectedGraduate.whyVgss || "No response"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">
                            Plans After VGSS
                          </Label>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg">
                            {selectedGraduate.plansAfterVgss || "No response"}
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
                                {new Date(
                                  selectedGraduate.serviceStartedDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          {selectedGraduate.serviceCompletedDate && (
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Service Completed
                              </Label>
                              <p>
                                {new Date(
                                  selectedGraduate.serviceCompletedDate
                                ).toLocaleDateString()}
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
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Graduate
                    </Button>
                    {!selectedGraduate.isApproved ? (
                      <Button
                        onClick={() => {
                          handleApproval(selectedGraduate.id, true);
                          setIsDetailModalOpen(false);
                        }}
                        disabled={isUpdating}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isUpdating && (
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
                        disabled={isUpdating}
                      >
                        {isUpdating && (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        )}
                        <XCircle className="w-4 h-4 mr-2" />
                        Revoke Approval
                      </Button>
                    )}
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
