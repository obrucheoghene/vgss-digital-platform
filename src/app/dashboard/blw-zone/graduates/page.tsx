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
import { useChaptersForZone } from "@/hooks/user-chapters";
import axios from "axios";

interface Graduate {
  id: string;
  userId?: string;
  graduateFirstname: string;
  graduateSurname: string;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string;
  graduateEmail?: string;
  maritalStatus?: "SINGLE" | "MARRIED";
  dateOfBirth?: string;
  stateOfOrigin?: string;
  nameOfZone?: string;
  nameOfFellowship?: string;
  nameOfChapterPastor: string;
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: number;
  grade?: string;
  nyscStatus?: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED";
  preferredCityOfPosting?: string;
  status?:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  isApproved?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  serviceStartedDate?: string;
  serviceCompletedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  isRegistered: boolean;
  registeredAt?: string;
  // Additional fields from zoneGraduates
  chapterId?: string;
  nameOfZonalPastor?: string;
  phoneNumberOfChapterPastor?: string;
  kingschatIDOfChapterPastor?: string;
  // Test questions preview
  visionMissionPurpose?: string;
  whyVgss?: string;
  plansAfterVgss?: string;
  chapter?: string;
}

interface GraduateStats {
  total: number;
  registered: number;
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGraduate, setEditingGraduate] = useState<Graduate | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for editing
  const [editForm, setEditForm] = useState({
    graduateFirstname: "",
    graduateSurname: "",
    graduateGender: "MALE" as "MALE" | "FEMALE",
    graduatePhoneNumber: "",
    nameOfUniversity: "",
    courseOfStudy: "",
    graduationYear: new Date().getFullYear(),
    chapterId: "",
    nameOfZonalPastor: "",
    nameOfChapterPastor: "",
    phoneNumberOfChapterPastor: "",
    kingschatIDOfChapterPastor: "",
  });

  const chaptersQuery = useChaptersForZone();
  const chapters = chaptersQuery.data?.chapters || [];

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

  // Stats calculated from graduates data
  const [stats, setStats] = useState<GraduateStats>({
    total: 0,
    registered: 0,
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

  // Calculate stats when graduates data changes
  useEffect(() => {
    if (allGraduates.length > 0) {
      const newStats: GraduateStats = {
        total: allGraduates.length,
        registered: allGraduates.filter((g) => g.isRegistered).length,
        underReview: allGraduates.filter((g) => g.status === "Under Review").length,
        interviewed: allGraduates.filter((g) => g.status === "Interviewed").length,
        serving: allGraduates.filter((g) => g.status === "Serving").length,
        completed: allGraduates.filter((g) => g.serviceCompletedDate).length,
        notAccepted: allGraduates.filter((g) => g.status === "Not Accepted").length,
        byGender: {
          MALE: allGraduates.filter((g) => g.graduateGender === "MALE").length,
          FEMALE: allGraduates.filter((g) => g.graduateGender === "FEMALE").length,
        },
        byStatus: {
          "Under Review": allGraduates.filter((g) => g.status === "Under Review").length,
          "Invited For Interview": allGraduates.filter((g) => g.status === "Invited For Interview").length,
          Interviewed: allGraduates.filter((g) => g.status === "Interviewed").length,
          Sighting: allGraduates.filter((g) => g.status === "Sighting").length,
          Serving: allGraduates.filter((g) => g.status === "Serving").length,
          "Not Accepted": allGraduates.filter((g) => g.status === "Not Accepted").length,
        },
      };
      setStats(newStats);
    }
  }, [allGraduates]);

  // Filter graduates based on search and filters
  useEffect(() => {
    let filtered = allGraduates;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (graduate) =>
          (graduate.graduateFirstname || "").toLowerCase().includes(query) ||
          (graduate.graduateSurname || "").toLowerCase().includes(query) ||
          (graduate.graduateEmail || "").toLowerCase().includes(query) ||
          (graduate.nameOfUniversity || "").toLowerCase().includes(query) ||
          (graduate.courseOfStudy || "").toLowerCase().includes(query) ||
          (graduate.nameOfZone || "").toLowerCase().includes(query) ||
          (graduate.nameOfFellowship || "").toLowerCase().includes(query)
      );
    }

    // Gender filter
    if (selectedGender && selectedGender !== "all") {
      filtered = filtered.filter(
        (graduate) => graduate.graduateGender === selectedGender
      );
    }

    // Status/Registration filter
    if (selectedStatus && selectedStatus !== "all") {
      if (selectedStatus === "registered") {
        filtered = filtered.filter((graduate) => graduate.isRegistered);
      } else {
        filtered = filtered.filter(
          (graduate) => graduate.status === selectedStatus
        );
      }
    }

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

  const handleOpenEditModal = (graduate: Graduate) => {
    setEditingGraduate(graduate);
    setEditForm({
      graduateFirstname: graduate.graduateFirstname || "",
      graduateSurname: graduate.graduateSurname || "",
      graduateGender: graduate.graduateGender || "MALE",
      graduatePhoneNumber: graduate.graduatePhoneNumber || "",
      nameOfUniversity: graduate.nameOfUniversity || "",
      courseOfStudy: graduate.courseOfStudy || "",
      graduationYear: graduate.graduationYear || new Date().getFullYear(),
      chapterId: graduate.chapterId || "",
      nameOfZonalPastor: graduate.nameOfZonalPastor || "",
      nameOfChapterPastor: graduate.nameOfChapterPastor || "",
      phoneNumberOfChapterPastor: graduate.phoneNumberOfChapterPastor || "",
      kingschatIDOfChapterPastor: graduate.kingschatIDOfChapterPastor || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingGraduate) return;

    setIsSaving(true);
    try {
      await axios.put(`/api/blw-zone/graduates/${editingGraduate.id}`, editForm);

      // Update local state
      setAllGraduates((prev) =>
        prev.map((grad) =>
          grad.id === editingGraduate.id
            ? { ...grad, ...editForm }
            : grad
        )
      );

      toast.success("Graduate updated successfully");
      setIsEditModalOpen(false);
      setEditingGraduate(null);
    } catch (error) {
      console.error("Error updating graduate:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.error || "Failed to update graduate");
      } else {
        toast.error("Failed to update graduate");
      }
    } finally {
      setIsSaving(false);
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
          {/* <div className="flex space-x-2">
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
          </div> */}
        </div>

        {/* Status Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All ({allGraduates.length})</TabsTrigger>
            <TabsTrigger value="registered">
              Registered ({stats.registered})
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
                                {graduate.isRegistered ? (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Registered
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
                                    <DropdownMenuItem
                                      onClick={() => handleOpenEditModal(graduate)}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Information
                                    </DropdownMenuItem>
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
                          {getStatusBadge(selectedGraduate.status || "Under Review")}
                          {selectedGraduate.updatedAt && (
                            <div className="text-sm text-muted-foreground">
                              Last updated:{" "}
                              {new Date(
                                selectedGraduate.updatedAt
                              ).toLocaleString()}
                            </div>
                          )}
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
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (selectedGraduate) {
                          setIsDetailModalOpen(false);
                          handleOpenEditModal(selectedGraduate);
                        }
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Graduate
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Graduate Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Graduate Information</DialogTitle>
              <DialogDescription>
                Update the graduate&apos;s information below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstname">First Name</Label>
                  <Input
                    id="edit-firstname"
                    value={editForm.graduateFirstname}
                    onChange={(e) =>
                      setEditForm({ ...editForm, graduateFirstname: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-surname">Surname</Label>
                  <Input
                    id="edit-surname"
                    value={editForm.graduateSurname}
                    onChange={(e) =>
                      setEditForm({ ...editForm, graduateSurname: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={editForm.graduateGender}
                    onValueChange={(value: "MALE" | "FEMALE") =>
                      setEditForm({ ...editForm, graduateGender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.graduatePhoneNumber}
                    onChange={(e) =>
                      setEditForm({ ...editForm, graduatePhoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-university">University</Label>
                  <Input
                    id="edit-university"
                    value={editForm.nameOfUniversity}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nameOfUniversity: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-course">Course of Study</Label>
                  <Input
                    id="edit-course"
                    value={editForm.courseOfStudy}
                    onChange={(e) =>
                      setEditForm({ ...editForm, courseOfStudy: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-year">Graduation Year</Label>
                  <Input
                    id="edit-year"
                    type="number"
                    value={editForm.graduationYear}
                    onChange={(e) =>
                      setEditForm({ ...editForm, graduationYear: parseInt(e.target.value) || new Date().getFullYear() })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-chapter">Chapter</Label>
                  <Select
                    value={editForm.chapterId}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, chapterId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-zonal-pastor">Name of Zonal Pastor</Label>
                <Input
                  id="edit-zonal-pastor"
                  value={editForm.nameOfZonalPastor}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nameOfZonalPastor: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-chapter-pastor">Name of Chapter Pastor</Label>
                  <Input
                    id="edit-chapter-pastor"
                    value={editForm.nameOfChapterPastor}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nameOfChapterPastor: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pastor-phone">Chapter Pastor Phone</Label>
                  <Input
                    id="edit-pastor-phone"
                    value={editForm.phoneNumberOfChapterPastor}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phoneNumberOfChapterPastor: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-kingschat">KingsChat ID of Chapter Pastor</Label>
                <Input
                  id="edit-kingschat"
                  value={editForm.kingschatIDOfChapterPastor}
                  onChange={(e) =>
                    setEditForm({ ...editForm, kingschatIDOfChapterPastor: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingGraduate(null);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
