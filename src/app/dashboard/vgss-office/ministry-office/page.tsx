// src/app/dashboard/vgss-office/service-department/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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
  Edit,
  UserPlus,
  Users,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  AlertCircle,
  TrendingUp,
  Activity,
  BarChart3,
  DollarSign,
  Star,
  XCircle,
  MessageSquare,
  Award,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { eq, and } from "drizzle-orm";
// import type { User, GraduateData, GraduateStatus } from "@/drizzle/schema";
// import { db } from "@/drizzle/db"; // Adjust path to your Drizzle DB setup

// Interfaces aligned with Drizzle schema
interface MinistryOffice {
  id: string;
  userId: string;
  name: string;
  email: string;
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  totalStaffRequested: number;
  currentStaff: number;
  completedStaff: number;
  pendingRequests: number;
  monthlyBudget: number;
  averageRating: number;
  lastRequestDate?: string;
}

interface StaffRequest {
  id: string;
  officeId: string;
  officeName: string;
  requestTitle: string;
  department: string;
  skillsRequired: string[];
  requestDate: string;
  urgency: "low" | "medium" | "high";
  status: "pending" | "reviewing" | "approved" | "assigned" | "rejected";
  requestedCount: number;
  assignedCount: number;
  description: string;
  preferredGender?: "MALE" | "FEMALE";
  minEducation?: string;
  notes?: string;
}

interface AssignedStaff {
  id: string;
  graduateId: string;
  graduateName: string;
  graduateEmail: string;
  graduateGender: "MALE" | "FEMALE";
  officeId: string;
  officeName: string;
  position: string;
  department: string;
  assignmentDate: string;
  serviceStartDate?: string;
  serviceEndDate?: string;
  status: "assigned" | "active" | "completed" | "terminated";
  performanceRating: number;
  monthlySalary: number;
  totalSalaryPaid: number;
  lastEvaluationDate?: string;
}

interface MinistryStats {
  totalOffices: number;
  activeOffices: number;
  inactiveOffices: number;
  totalStaffRequests: number;
  totalAssignedStaff: number;
  activeStaff: number;
  totalBudget: number;
  averagePerformance: number;
  recentActivity: {
    newRequests: number;
    newAssignments: number;
    completedServices: number;
  };
}

export default function MinistryOfficeManagementPage() {
  const [offices, setOffices] = useState<MinistryOffice[]>([]);
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<AssignedStaff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOffice, setSelectedOffice] = useState<MinistryOffice | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] = useState<StaffRequest | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("offices");
  const itemsPerPage = 15;
  const router = useRouter();

  const [stats, setStats] = useState<MinistryStats>({
    totalOffices: 0,
    activeOffices: 0,
    inactiveOffices: 0,
    totalStaffRequests: 0,
    totalAssignedStaff: 0,
    activeStaff: 0,
    totalBudget: 0,
    averagePerformance: 0,
    recentActivity: {
      newRequests: 0,
      newAssignments: 0,
      completedServices: 0,
    },
  });

  // Fetch data from Drizzle ORM
  // useEffect(() => {
  //   const loadData = async () => {
  //     setIsLoading(true);
  //     try {
  //       // Fetch Service Departments (users with type SERVICE_DEPARTMENT)
  //       const ministryUsers = await db
  //         .select()
  //         .from(users)
  //         .where(eq(users.type, "SERVICE_DEPARTMENT"))
  //         .execute();

  //       // Fetch related graduate data for staff assignments
  //       const graduateAssignments = await db
  //         .select()
  //         .from(graduateData)
  //         .where(eq(graduateData.ministryOfficeId, users.id))
  //         .execute();

  //       // Fetch graduate status for tracking
  //       const graduateStatuses = await db
  //         .select()
  //         .from(graduateStatus)
  //         .execute();

  //       // Transform data to match MinistryOffice interface
  //       const mockOffices: MinistryOffice[] = ministryUsers.map(
  //         (user: User) => {
  //           const assignedGraduates = graduateAssignments.filter(
  //             (g: GraduateData) => g.ministryOfficeId === user.id
  //           );
  //           const activeStaff = assignedGraduates.filter((g) =>
  //             graduateStatuses.some(
  //               (s: GraduateStatus) =>
  //                 s.graduateDataId === g.id &&
  //                 s.serviceStarted &&
  //                 !s.serviceCompleted
  //             )
  //           ).length;
  //           const completedStaff = assignedGraduates.filter((g) =>
  //             graduateStatuses.some(
  //               (s: GraduateStatus) =>
  //                 s.graduateDataId === g.id && s.serviceCompleted
  //             )
  //           ).length;

  //           return {
  //             id: user.id,
  //             userId: user.id,
  //             name: user.name,
  //             email: user.email,
  //             accountStatus: user.isActive ? "active" : "pending_activation",
  //             isDeactivated: !user.isActive,
  //             createdAt: user.createdAt.toISOString(),
  //             updatedAt: user.updatedAt.toISOString(),
  //             lastLogin: undefined, // Add logic for last login if available
  //             totalStaffRequested: assignedGraduates.length,
  //             currentStaff: activeStaff,
  //             completedStaff: completedStaff,
  //             pendingRequests: 0, // Add logic for pending requests
  //             monthlyBudget: 0, // Add logic for budget
  //             averageRating: 0, // Add logic for performance rating
  //             lastRequestDate: undefined, // Add logic for last request
  //           };
  //         }
  //       );

  //       // Mock staff requests and assigned staff (replace with actual DB queries)
  //       const mockRequests: StaffRequest[] = []; // Implement actual query
  //       const mockAssignedStaff: AssignedStaff[] = graduateAssignments.map(
  //         (g: GraduateData) => ({
  //           id: g.id,
  //           graduateId: g.userId,
  //           graduateName: g.graduateName,
  //           graduateEmail: g.email,
  //           graduateGender: g.graduateGender,
  //           officeId: g.ministryOfficeId!,
  //           officeName:
  //             ministryUsers.find((u: User) => u.id === g.ministryOfficeId)
  //               ?.name || "Unknown",
  //           position: "Staff", // Add logic for position
  //           department: "Unknown", // Add logic for department
  //           assignmentDate: g.createdAt.toISOString(),
  //           serviceStartDate: graduateStatuses
  //             .find((s: GraduateStatus) => s.graduateDataId === g.id)
  //             ?.serviceStartedAt?.toISOString(),
  //           serviceEndDate: graduateStatuses
  //             .find((s: GraduateStatus) => s.graduateDataId === g.id)
  //             ?.serviceCompletedAt?.toISOString(),
  //           status: graduateStatuses.find(
  //             (s: GraduateStatus) => s.graduateDataId === g.id
  //           )?.serviceCompleted
  //             ? "completed"
  //             : graduateStatuses.find(
  //                 (s: GraduateStatus) => s.graduateDataId === g.id
  //               )?.serviceStarted
  //             ? "active"
  //             : "assigned",
  //           performanceRating: 0, // Add logic for rating
  //           monthlySalary: 0, // Add logic for salary
  //           totalSalaryPaid: 0, // Add logic for total paid
  //           lastEvaluationDate: undefined, // Add logic for evaluation
  //         })
  //       );

  //       setOffices(mockOffices);
  //       setRequests(mockRequests);
  //       setAssignedStaff(mockAssignedStaff);

  //       // Calculate stats
  //       const calculatedStats: MinistryStats = {
  //         totalOffices: mockOffices.length,
  //         activeOffices: mockOffices.filter(
  //           (o) => o.accountStatus === "active" && !o.isDeactivated
  //         ).length,
  //         inactiveOffices: mockOffices.filter(
  //           (o) => o.accountStatus === "pending_activation" || o.isDeactivated
  //         ).length,
  //         totalStaffRequests: mockRequests.length,
  //         totalAssignedStaff: mockAssignedStaff.length,
  //         activeStaff: mockAssignedStaff.filter((s) => s.status === "active")
  //           .length,
  //         totalBudget: mockOffices.reduce(
  //           (sum, office) => sum + office.monthlyBudget,
  //           0
  //         ),
  //         averagePerformance: mockAssignedStaff.length
  //           ? mockAssignedStaff.reduce(
  //               (sum, staff) => sum + staff.performanceRating,
  //               0
  //             ) / mockAssignedStaff.length
  //           : 0,
  //         recentActivity: {
  //           newRequests: mockRequests.filter(
  //             (r) =>
  //               new Date(r.requestDate) >
  //               new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  //           ).length,
  //           newAssignments: mockAssignedStaff.filter(
  //             (s) =>
  //               new Date(s.assignmentDate) >
  //               new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  //           ).length,
  //           completedServices: mockAssignedStaff.filter(
  //             (s) =>
  //               s.status === "completed" &&
  //               s.serviceEndDate &&
  //               new Date(s.serviceEndDate) >
  //                 new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  //           ).length,
  //         },
  //       };

  //       setStats(calculatedStats);
  //     } catch (error) {
  //       toast.error("Failed to load Service Department data");
  //       console.error("Error loading Service Department data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   loadData();
  // }, []);

  // Memoized filtered offices
  const filteredOffices = useMemo(() => {
    return offices.filter((office) => {
      const matchesSearch =
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" &&
          office.accountStatus === "active" &&
          !office.isDeactivated) ||
        (selectedStatus === "pending" &&
          office.accountStatus === "pending_activation") ||
        (selectedStatus === "inactive" && office.isDeactivated);

      return matchesSearch && matchesStatus;
    });
  }, [offices, searchQuery, selectedStatus]);

  // Get status badge for offices
  const getOfficeStatusBadge = (office: MinistryOffice) => {
    if (office.isDeactivated) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Deactivated
        </Badge>
      );
    }

    if (office.accountStatus === "pending_activation") {
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

  // Get status badge for requests
  const getRequestStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { className: "bg-yellow-100 text-yellow-800", icon: Clock },
      reviewing: { className: "bg-blue-100 text-blue-800", icon: Eye },
      approved: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      assigned: { className: "bg-purple-100 text-purple-800", icon: Users },
      rejected: { className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      className: "bg-gray-100 text-gray-800",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Get urgency badge
  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      high: { className: "bg-red-100 text-red-800", label: "High" },
      medium: { className: "bg-yellow-100 text-yellow-800", label: "Medium" },
      low: { className: "bg-green-100 text-green-800", label: "Low" },
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || {
      className: "bg-gray-100 text-gray-800",
      label: urgency,
    };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Handle request actions
  const handleRequestAction = async (requestId: string, action: string) => {
    try {
      // Simulate API call (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: action as StaffRequest["status"] }
            : req
        )
      );

      toast.success(`Request ${action} successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} request`);
      console.error(
        `Error performing ${action} on request ${requestId}:`,
        error
      );
    }
  };

  // Handle office activation/deactivation
  const handleOfficeToggle = async (officeId: string, activate: boolean) => {
    try {
      // await db
      //   .update(users)
      //   .set({ isActive: activate })
      //   .where(eq(users.id, officeId))
      //   .execute();

      setOffices((prev) =>
        prev.map((office) =>
          office.id === officeId
            ? {
                ...office,
                isDeactivated: !activate,
                accountStatus: activate ? "active" : "pending_activation",
              }
            : office
        )
      );
      toast.success(
        `Office ${activate ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error(`Failed to ${activate ? "activate" : "deactivate"} office`);
      console.error(error);
    }
  };

  // Pagination for offices
  const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffices = filteredOffices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <DashboardLayout title="Service Department Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Service Department Management
            </h1>
            <p className="text-muted-foreground">
              Manage Service Departments, staff requests, and service
              assignments
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button onClick={() => router.refresh()} disabled={isLoading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/dashboard/vgss-office/create-account">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Office
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
                  <p className="text-sm text-muted-foreground">Total Offices</p>
                  <p className="text-2xl font-bold">{stats.totalOffices}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Staff</p>
                  <p className="text-2xl font-bold">{stats.activeStaff}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Budget
                  </p>
                  <p className="text-2xl font-bold">
                    ₦{(stats.totalBudget / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Avg Performance
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.averagePerformance.toFixed(1)}/5.0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Recent Activity (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.recentActivity.newRequests}
                </div>
                <div className="text-sm text-muted-foreground">
                  New Staff Requests
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {stats.recentActivity.newAssignments}
                </div>
                <div className="text-sm text-muted-foreground">
                  New Assignments
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.recentActivity.completedServices}
                </div>
                <div className="text-sm text-muted-foreground">
                  Completed Services
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="offices">
              Offices ({stats.totalOffices})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Staff Requests ({requests.length})
            </TabsTrigger>
            <TabsTrigger value="assignments">
              Current Staff ({assignedStaff.length})
            </TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Offices Tab */}
          <TabsContent value="offices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Service Department Directory
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search offices
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by office name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        aria-label="Search offices by name or email"
                      />
                    </div>
                  </div>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger
                      className="w-full sm:w-48"
                      aria-label="Filter by office status"
                    >
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Offices</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Deactivated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Offices Table */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Office</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Staff Overview</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading Service Departments...
                          </TableCell>
                        </TableRow>
                      ) : paginatedOffices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No offices found
                            </h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filter criteria.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedOffices.map((office) => (
                          <TableRow
                            key={office.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                  <Building className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{office.name}</p>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {office.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getOfficeStatusBadge(office)}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {office.currentStaff}
                                  </span>
                                  <span className="text-muted-foreground">
                                    active
                                  </span>
                                  <span className="text-xs">•</span>
                                  <span className="text-sm text-muted-foreground">
                                    {office.completedStaff} completed
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="text-orange-600">
                                    {office.pendingRequests} pending requests
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(office.averageRating)
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  {office.averageRating.toFixed(1)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">
                                  ₦{office.monthlyBudget.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  per month
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {office.lastLogin ? (
                                <div className="text-sm">
                                  <p>
                                    {new Date(
                                      office.lastLogin
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      office.lastLogin
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  Never
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Actions for ${office.name}`}
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Office Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedOffice(office);
                                      setIsDetailModalOpen(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/vgss-office/edit/${office.id}`
                                      )
                                    }
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Office
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/vgss-office/analytics/${office.id}`
                                      )
                                    }
                                  >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                        className={
                                          office.isDeactivated
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {office.isDeactivated ? (
                                          <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Activate Office
                                          </>
                                        ) : (
                                          <>
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Deactivate Office
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          {office.isDeactivated
                                            ? "Activate Office"
                                            : "Deactivate Office"}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to{" "}
                                          {office.isDeactivated
                                            ? "activate"
                                            : "deactivate"}{" "}
                                          {office.name}? This will{" "}
                                          {office.isDeactivated
                                            ? "enable"
                                            : "disable"}{" "}
                                          all operations for this office.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleOfficeToggle(
                                              office.id,
                                              !office.isDeactivated
                                            )
                                          }
                                        >
                                          {office.isDeactivated
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
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredOffices.length
                      )}{" "}
                      of {filteredOffices.length} offices
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        aria-label="Previous page"
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
                                aria-label={`Page ${pageNum}`}
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
                        aria-label="Next page"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Staff Requests Management
                </CardTitle>
                <CardDescription>
                  Review and manage staff requests from Service Departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No staff requests found
                      </h3>
                      <p className="text-muted-foreground">
                        Staff requests from Service Departments will appear
                        here.
                      </p>
                    </div>
                  ) : (
                    requests.map((request) => (
                      <div
                        key={request.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">
                                {request.requestTitle}
                              </h3>
                              {getRequestStatusBadge(request.status)}
                              {getUrgencyBadge(request.urgency)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {request.officeName}
                              </span>
                              <span>{request.department}</span>
                              <span>{request.requestedCount} position(s)</span>
                            </div>
                            <p className="text-sm mb-3">
                              {request.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {request.skillsRequired.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>
                              {new Date(
                                request.requestDate
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              {new Date(
                                request.requestDate
                              ).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-sm text-muted-foreground">
                            {request.assignedCount > 0 && (
                              <span>
                                {request.assignedCount}/{request.requestedCount}{" "}
                                assigned
                              </span>
                            )}
                            {request.preferredGender && (
                              <span className="ml-3">
                                Preferred: {request.preferredGender}
                              </span>
                            )}
                            {request.minEducation && (
                              <span className="ml-3">
                                Min Education: {request.minEducation}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsRequestModalOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                            {request.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleRequestAction(request.id, "approved")
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleRequestAction(request.id, "rejected")
                                  }
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {request.status === "approved" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/vgss-office/assign-staff/${request.id}`
                                  )
                                }
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Assign Staff
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Staff Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Current Staff Assignments
                </CardTitle>
                <CardDescription>
                  Monitor active VGSS staff across all Service Departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Graduate</TableHead>
                        <TableHead>Service Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedStaff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No staff assignments found
                            </h3>
                            <p className="text-muted-foreground">
                              Staff assignments will appear here when graduates
                              are assigned to Service Departments.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        assignedStaff.map((staff) => (
                          <TableRow
                            key={staff.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {staff.graduateName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {staff.graduateEmail}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {staff.officeName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {staff.department}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{staff.position}</p>
                              <p className="text-xs text-muted-foreground">
                                Since{" "}
                                {new Date(
                                  staff.assignmentDate
                                ).toLocaleDateString()}
                              </p>
                            </TableCell>
                            <TableCell>
                              {staff.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              ) : staff.status === "completed" ? (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <Award className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              ) : staff.status === "assigned" ? (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Assigned
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Terminated
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${
                                        i < Math.floor(staff.performanceRating)
                                          ? "text-yellow-500 fill-yellow-500"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  {staff.performanceRating.toFixed(1)}
                                </span>
                              </div>
                              {staff.lastEvaluationDate && (
                                <p className="text-xs text-muted-foreground">
                                  Last review:{" "}
                                  {new Date(
                                    staff.lastEvaluationDate
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">
                                  ₦{staff.monthlySalary.toLocaleString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Total paid: ₦
                                  {staff.totalSalaryPaid.toLocaleString()}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    aria-label={`Actions for ${staff.graduateName}`}
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Staff Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/vgss-office/staff/${staff.graduateId}`
                                      )
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Full Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/vgss-office/staff/${staff.graduateId}/evaluations`
                                      )
                                    }
                                  >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    View Evaluations
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/vgss-office/staff/${staff.graduateId}/salary`
                                      )
                                    }
                                  >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Salary History
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {staff.status === "active" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(
                                          `/dashboard/vgss-office/staff/${staff.graduateId}/edit`
                                        )
                                      }
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Update Assignment
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Office Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offices
                      .filter(
                        (o) => o.accountStatus === "active" && !o.isDeactivated
                      )
                      .map((office) => (
                        <div
                          key={office.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{office.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {office.currentStaff} active staff
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < Math.floor(office.averageRating)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm font-medium">
                              {office.averageRating.toFixed(1)}/5.0
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Budget Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {offices
                      .filter((o) => o.monthlyBudget > 0)
                      .map((office) => {
                        const percentage =
                          stats.totalBudget > 0
                            ? (office.monthlyBudget / stats.totalBudget) * 100
                            : 0;
                        return (
                          <div key={office.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {office.name}
                              </span>
                              <span className="text-sm">
                                ₦{office.monthlyBudget.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {percentage.toFixed(1)}% of total budget
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Office Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Office Details: {selectedOffice?.name}
              </DialogTitle>
              <DialogDescription>
                Comprehensive Service Department information and performance
                metrics
              </DialogDescription>
            </DialogHeader>

            {selectedOffice && (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Office Status and Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Office Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Office Name
                            </Label>
                            <p className="font-medium">{selectedOffice.name}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Email
                            </Label>
                            <p className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {selectedOffice.email}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Status
                            </Label>
                            <div className="mt-1">
                              {getOfficeStatusBadge(selectedOffice)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Activity className="w-4 h-4 mr-2" />
                          Activity Summary
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Created
                            </Label>
                            <p>
                              {new Date(
                                selectedOffice.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Last Login
                            </Label>
                            <p>
                              {selectedOffice.lastLogin
                                ? new Date(
                                    selectedOffice.lastLogin
                                  ).toLocaleString()
                                : "Never"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Last Request
                            </Label>
                            <p>
                              {selectedOffice.lastRequestDate
                                ? new Date(
                                    selectedOffice.lastRequestDate
                                  ).toLocaleDateString()
                                : "No requests"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Staff Statistics */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Staff Overview
                      </h3>
                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedOffice.totalStaffRequested}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Requested
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedOffice.currentStaff}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Currently Active
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedOffice.completedStaff}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Completed Service
                          </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedOffice.pendingRequests}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Pending Requests
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Budget and Performance */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Budget Information
                        </h3>
                        <div className="text-center">
                          <p className="text-3xl font-bold">
                            ₦{selectedOffice.monthlyBudget.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Monthly Budget
                          </p>
                          {selectedOffice.currentStaff > 0 && (
                            <p className="text-xs text-muted-foreground mt-2">
                              ≈ ₦
                              {Math.round(
                                selectedOffice.monthlyBudget /
                                  selectedOffice.currentStaff
                              ).toLocaleString()}{" "}
                              per staff
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Star className="w-4 h-4 mr-2" />
                          Performance Rating
                        </h3>
                        <div className="text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-6 h-6 ${
                                    i < Math.floor(selectedOffice.averageRating)
                                      ? "text-yellow-500 fill-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-2xl font-bold">
                            {selectedOffice.averageRating.toFixed(1)}/5.0
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Average Staff Rating
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

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
                      onClick={() =>
                        router.push(
                          `/dashboard/vgss-office/analytics/${selectedOffice.id}`
                        )
                      }
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Full Analytics
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(
                          `/dashboard/vgss-office/edit/${selectedOffice.id}`
                        )
                      }
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Office
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant={
                            selectedOffice.isDeactivated
                              ? "default"
                              : "destructive"
                          }
                          className={
                            selectedOffice.isDeactivated
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          {selectedOffice.isDeactivated ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate Office
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Deactivate Office
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {selectedOffice.isDeactivated
                              ? "Activate Office"
                              : "Deactivate Office"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to{" "}
                            {selectedOffice.isDeactivated
                              ? "activate"
                              : "deactivate"}{" "}
                            {selectedOffice.name}? This will{" "}
                            {selectedOffice.isDeactivated
                              ? "enable"
                              : "disable"}{" "}
                            all operations for this office.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleOfficeToggle(
                                selectedOffice.id,
                                !selectedOffice.isDeactivated
                              )
                            }
                          >
                            {selectedOffice.isDeactivated
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

        {/* Request Detail Modal */}
        <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Request Details: {selectedRequest?.requestTitle}
              </DialogTitle>
              <DialogDescription>
                Full details of the staff request
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Request Title
                  </Label>
                  <p className="font-medium">{selectedRequest.requestTitle}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Office
                  </Label>
                  <p className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {selectedRequest.officeName}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Department
                  </Label>
                  <p>{selectedRequest.department}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <div className="mt-1">
                    {getRequestStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Urgency
                  </Label>
                  <div className="mt-1">
                    {getUrgencyBadge(selectedRequest.urgency)}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Skills Required
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedRequest.skillsRequired.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Positions
                  </Label>
                  <p>
                    {selectedRequest.assignedCount}/
                    {selectedRequest.requestedCount} assigned
                  </p>
                </div>
                {selectedRequest.preferredGender && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Preferred Gender
                    </Label>
                    <p>{selectedRequest.preferredGender}</p>
                  </div>
                )}
                {selectedRequest.minEducation && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Minimum Education
                    </Label>
                    <p>{selectedRequest.minEducation}</p>
                  </div>
                )}
                {selectedRequest.notes && (
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Notes
                    </Label>
                    <p className="text-sm">{selectedRequest.notes}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsRequestModalOpen(false)}
                  >
                    Close
                  </Button>
                  {selectedRequest.status === "pending" && (
                    <>
                      <Button
                        onClick={() =>
                          handleRequestAction(selectedRequest.id, "approved")
                        }
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleRequestAction(selectedRequest.id, "rejected")
                        }
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === "approved" && (
                    <Button
                      onClick={() =>
                        router.push(
                          `/dashboard/vgss-office/assign-staff/${selectedRequest.id}`
                        )
                      }
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Assign Staff
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
