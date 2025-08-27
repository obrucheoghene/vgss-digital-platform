// src/app/dashboard/vgss-office/zones/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  Building,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  UserPlus,
  Upload,
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
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Zone {
  id: string;
  userId: string;
  name: string;
  email: string;
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  // Zone statistics
  totalGraduatesUploaded: number;
  registeredGraduates: number;
  pendingGraduates: number;
  recentUploads: number;
  lastUploadDate?: string;
}

interface ZoneUpload {
  id: string;
  zoneId: string;
  zoneName: string;
  filename: string;
  uploadDate: string;
  totalRecords: number;
  successfulRecords: number;
  duplicateRecords: number;
  errorRecords: number;
  status: "processing" | "completed" | "failed";
}

interface ZoneGraduate {
  id: string;
  zoneId: string;
  zoneName: string;
  graduateFirstname: string;
  graduateLastname: string;
  graduateGender: "MALE" | "FEMALE";
  nameOfFellowship: string;
  nameOfChapterPastor: string;
  isRegistered: boolean;
  registeredAt?: string;
  createdAt: string;
}

interface ZoneStats {
  totalZones: number;
  activeZones: number;
  inactiveZones: number;
  totalUploads: number;
  totalGraduates: number;
  registeredGraduates: number;
  recentActivity: {
    newZones: number;
    newUploads: number;
    newRegistrations: number;
  };
}

export default function BLWZoneManagementPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [uploads, setUploads] = useState<ZoneUpload[]>([]);
  const [graduates, setGraduates] = useState<ZoneGraduate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("zones");
  const itemsPerPage = 15;

  // Stats state
  const [stats, setStats] = useState<ZoneStats>({
    totalZones: 0,
    activeZones: 0,
    inactiveZones: 0,
    totalUploads: 0,
    totalGraduates: 0,
    registeredGraduates: 0,
    recentActivity: {
      newZones: 0,
      newUploads: 0,
      newRegistrations: 0,
    },
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock zones data
        const mockZones: Zone[] = [
          {
            id: "zone1",
            userId: "user1",
            name: "Lagos Zone 1",
            email: "lagos1@loveworld.org",
            accountStatus: "active",
            isDeactivated: false,
            createdAt: "2023-01-15T10:30:00Z",
            updatedAt: "2024-01-20T14:30:00Z",
            lastLogin: "2024-01-25T09:15:00Z",
            totalGraduatesUploaded: 45,
            registeredGraduates: 32,
            pendingGraduates: 13,
            recentUploads: 3,
            lastUploadDate: "2024-01-22T16:20:00Z",
          },
          {
            id: "zone2",
            userId: "user2",
            name: "Abuja Zone 2",
            email: "abuja2@loveworld.org",
            accountStatus: "active",
            isDeactivated: false,
            createdAt: "2023-02-10T08:45:00Z",
            updatedAt: "2024-01-18T11:00:00Z",
            lastLogin: "2024-01-24T15:30:00Z",
            totalGraduatesUploaded: 38,
            registeredGraduates: 28,
            pendingGraduates: 10,
            recentUploads: 2,
            lastUploadDate: "2024-01-20T10:45:00Z",
          },
          {
            id: "zone3",
            userId: "user3",
            name: "Port Harcourt Zone 1",
            email: "ph1@loveworld.org",
            accountStatus: "pending_activation",
            isDeactivated: false,
            createdAt: "2023-12-05T14:20:00Z",
            updatedAt: "2023-12-05T14:20:00Z",
            totalGraduatesUploaded: 0,
            registeredGraduates: 0,
            pendingGraduates: 0,
            recentUploads: 0,
          },
          {
            id: "zone4",
            userId: "user4",
            name: "Ibadan Zone 3",
            email: "ibadan3@loveworld.org",
            accountStatus: "active",
            isDeactivated: false,
            createdAt: "2023-03-20T12:15:00Z",
            updatedAt: "2024-01-15T13:45:00Z",
            lastLogin: "2024-01-23T08:20:00Z",
            totalGraduatesUploaded: 29,
            registeredGraduates: 22,
            pendingGraduates: 7,
            recentUploads: 1,
            lastUploadDate: "2024-01-15T13:45:00Z",
          },
          {
            id: "zone5",
            userId: "user5",
            name: "Kano Zone 1",
            email: "kano1@loveworld.org",
            accountStatus: "active",
            isDeactivated: true,
            createdAt: "2023-06-10T09:30:00Z",
            updatedAt: "2023-12-20T16:00:00Z",
            lastLogin: "2023-12-18T11:30:00Z",
            totalGraduatesUploaded: 15,
            registeredGraduates: 12,
            pendingGraduates: 3,
            recentUploads: 0,
            lastUploadDate: "2023-12-18T11:30:00Z",
          },
        ];

        // Mock uploads data
        const mockUploads: ZoneUpload[] = [
          {
            id: "upload1",
            zoneId: "zone1",
            zoneName: "Lagos Zone 1",
            filename: "january_graduates_2024.xlsx",
            uploadDate: "2024-01-22T16:20:00Z",
            totalRecords: 25,
            successfulRecords: 23,
            duplicateRecords: 2,
            errorRecords: 0,
            status: "completed",
          },
          {
            id: "upload2",
            zoneId: "zone2",
            zoneName: "Abuja Zone 2",
            filename: "new_graduates_batch2.csv",
            uploadDate: "2024-01-20T10:45:00Z",
            totalRecords: 18,
            successfulRecords: 18,
            duplicateRecords: 0,
            errorRecords: 0,
            status: "completed",
          },
          {
            id: "upload3",
            zoneId: "zone1",
            zoneName: "Lagos Zone 1",
            filename: "december_graduates_2023.xlsx",
            uploadDate: "2024-01-15T14:30:00Z",
            totalRecords: 20,
            successfulRecords: 18,
            duplicateRecords: 1,
            errorRecords: 1,
            status: "completed",
          },
          {
            id: "upload4",
            zoneId: "zone4",
            zoneName: "Ibadan Zone 3",
            filename: "graduate_list_jan2024.csv",
            uploadDate: "2024-01-15T13:45:00Z",
            totalRecords: 12,
            successfulRecords: 11,
            duplicateRecords: 0,
            errorRecords: 1,
            status: "completed",
          },
          {
            id: "upload5",
            zoneId: "zone2",
            zoneName: "Abuja Zone 2",
            filename: "processing_batch.xlsx",
            uploadDate: "2024-01-25T11:20:00Z",
            totalRecords: 15,
            successfulRecords: 0,
            duplicateRecords: 0,
            errorRecords: 0,
            status: "processing",
          },
        ];

        // Mock graduates data
        const mockGraduates: ZoneGraduate[] = [
          {
            id: "grad1",
            zoneId: "zone1",
            zoneName: "Lagos Zone 1",
            graduateFirstname: "John",
            graduateLastname: "Adeyemi",
            graduateGender: "MALE",
            nameOfFellowship: "Victory Fellowship",
            nameOfChapterPastor: "Pastor Mary Johnson",
            isRegistered: true,
            registeredAt: "2024-01-23T10:30:00Z",
            createdAt: "2024-01-22T16:25:00Z",
          },
          {
            id: "grad2",
            zoneId: "zone2",
            zoneName: "Abuja Zone 2",
            graduateFirstname: "Sarah",
            graduateLastname: "Okafor",
            graduateGender: "FEMALE",
            nameOfFellowship: "Faith Chapel",
            nameOfChapterPastor: "Pastor David Wilson",
            isRegistered: true,
            registeredAt: "2024-01-21T14:15:00Z",
            createdAt: "2024-01-20T10:50:00Z",
          },
          {
            id: "grad3",
            zoneId: "zone1",
            zoneName: "Lagos Zone 1",
            graduateFirstname: "Michael",
            graduateLastname: "Eze",
            graduateGender: "MALE",
            nameOfFellowship: "Grace Assembly",
            nameOfChapterPastor: "Pastor Emmanuel Kings",
            isRegistered: false,
            createdAt: "2024-01-22T16:25:00Z",
          },
          {
            id: "grad4",
            zoneId: "zone4",
            zoneName: "Ibadan Zone 3",
            graduateFirstname: "Grace",
            graduateLastname: "Adebayo",
            graduateGender: "FEMALE",
            nameOfFellowship: "Hope Center",
            nameOfChapterPastor: "Pastor Ruth Akinola",
            isRegistered: false,
            createdAt: "2024-01-15T13:50:00Z",
          },
        ];

        setZones(mockZones);
        setUploads(mockUploads);
        setGraduates(mockGraduates);

        // Calculate stats
        const calculatedStats: ZoneStats = {
          totalZones: mockZones.length,
          activeZones: mockZones.filter(
            (z) => z.accountStatus === "active" && !z.isDeactivated
          ).length,
          inactiveZones: mockZones.filter(
            (z) => z.accountStatus === "pending_activation" || z.isDeactivated
          ).length,
          totalUploads: mockUploads.length,
          totalGraduates: mockZones.reduce(
            (sum, zone) => sum + zone.totalGraduatesUploaded,
            0
          ),
          registeredGraduates: mockZones.reduce(
            (sum, zone) => sum + zone.registeredGraduates,
            0
          ),
          recentActivity: {
            newZones: mockZones.filter(
              (z) =>
                new Date(z.createdAt) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length,
            newUploads: mockUploads.filter(
              (u) =>
                new Date(u.uploadDate) >
                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
            newRegistrations: mockGraduates.filter(
              (g) =>
                g.registeredAt &&
                new Date(g.registeredAt) >
                  new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length,
          },
        };

        setStats(calculatedStats);
      } catch (error) {
        toast.error("Failed to load zone data");
        console.error("Error loading zone data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter zones
  const filteredZones = zones.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" &&
        zone.accountStatus === "active" &&
        !zone.isDeactivated) ||
      (selectedStatus === "pending" &&
        zone.accountStatus === "pending_activation") ||
      (selectedStatus === "inactive" && zone.isDeactivated);

    return matchesSearch && matchesStatus;
  });

  // Get status badge
  const getStatusBadge = (zone: Zone) => {
    if (zone.isDeactivated) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Deactivated
        </Badge>
      );
    }

    if (zone.accountStatus === "pending_activation") {
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

  // Get upload status badge
  const getUploadStatusBadge = (status: string) => {
    const statusConfig = {
      processing: { className: "bg-blue-100 text-blue-800", icon: Clock },
      completed: {
        className: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      failed: { className: "bg-red-100 text-red-800", icon: AlertCircle },
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

  // Pagination for zones
  const totalPages = Math.ceil(filteredZones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedZones = filteredZones.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <DashboardLayout title="Zone Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">BLW Zone Management</h1>
            <p className="text-muted-foreground">
              Manage BLW Zones, monitor uploads, and track graduate
              registrations
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
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
            <Link href="/dashboard/vgss-office/create-account">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Zone
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="zones">Zones ({stats.totalZones})</TabsTrigger>
            <TabsTrigger value="uploads">
              Recent Uploads ({uploads.length})
            </TabsTrigger>
            <TabsTrigger value="graduates">
              Graduate Records ({graduates.length})
            </TabsTrigger>
          </TabsList>

          {/* Zones Tab */}
          <TabsContent value="zones" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    Zone Directory
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search zones
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by zone name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Deactivated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Zones Table */}
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Graduates</TableHead>
                        <TableHead>Recent Activity</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading zones...
                          </TableCell>
                        </TableRow>
                      ) : paginatedZones.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No zones found
                            </h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filter criteria.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedZones.map((zone) => (
                          <TableRow key={zone.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Building className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{zone.name}</p>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Mail className="w-3 h-3 mr-1" />
                                    {zone.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(zone)}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">
                                    {zone.totalGraduatesUploaded}
                                  </span>
                                  <span className="text-muted-foreground">
                                    total
                                  </span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {zone.registeredGraduates} registered •{" "}
                                  {zone.pendingGraduates} pending
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        zone.totalGraduatesUploaded
                                          ? (zone.registeredGraduates /
                                              zone.totalGraduatesUploaded) *
                                            100
                                          : 0
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {zone.recentUploads > 0 ? (
                                <div className="space-y-1">
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50"
                                  >
                                    {zone.recentUploads} recent uploads
                                  </Badge>
                                  {zone.lastUploadDate && (
                                    <p className="text-xs text-muted-foreground">
                                      Last:{" "}
                                      {new Date(
                                        zone.lastUploadDate
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  No recent activity
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {zone.lastLogin ? (
                                <div className="text-sm">
                                  <p>
                                    {new Date(
                                      zone.lastLogin
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      zone.lastLogin
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
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Zone Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedZone(zone);
                                      setIsDetailModalOpen(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Zone
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Analytics
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {zone.isDeactivated ? (
                                    <DropdownMenuItem className="text-green-600">
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Activate Zone
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem className="text-red-600">
                                      <AlertCircle className="w-4 h-4 mr-2" />
                                      Deactivate Zone
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredZones.length
                      )}{" "}
                      of {filteredZones.length} zones
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

          {/* Uploads Tab */}
          <TabsContent value="uploads" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Recent Upload Activity
                </CardTitle>
                <CardDescription>
                  Monitor file uploads and processing status from all zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploads.length === 0 ? (
                    <div className="text-center py-8">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No uploads found
                      </h3>
                      <p className="text-muted-foreground">
                        Upload activity will appear here when zones start
                        uploading graduate data.
                      </p>
                    </div>
                  ) : (
                    uploads.map((upload) => (
                      <div
                        key={upload.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{upload.filename}</p>
                              <p className="text-sm text-muted-foreground">
                                {upload.zoneName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getUploadStatusBadge(upload.status)}
                            <span className="text-sm text-muted-foreground">
                              {new Date(upload.uploadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4 text-sm">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="font-bold text-blue-600">
                              {upload.totalRecords}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Total Records
                            </div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="font-bold text-green-600">
                              {upload.successfulRecords}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Successful
                            </div>
                          </div>
                          <div className="text-center p-2 bg-yellow-50 rounded">
                            <div className="font-bold text-yellow-600">
                              {upload.duplicateRecords}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Duplicates
                            </div>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded">
                            <div className="font-bold text-red-600">
                              {upload.errorRecords}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Errors
                            </div>
                          </div>
                        </div>

                        {upload.status === "processing" && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Processing...</span>
                              <span>75%</span>
                            </div>
                            <Progress value={75} />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Graduates Tab */}
          <TabsContent value="graduates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Graduate Records by Zone
                </CardTitle>
                <CardDescription>
                  View all graduate records uploaded by zones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Graduate</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Fellowship</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {graduates.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No graduate records found
                            </h3>
                            <p className="text-muted-foreground">
                              Graduate records will appear here when zones
                              upload their data.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        graduates.map((graduate) => (
                          <TableRow
                            key={graduate.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    {graduate.graduateFirstname}{" "}
                                    {graduate.graduateLastname}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {graduate.graduateGender}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{graduate.zoneName}</p>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">
                                  {graduate.nameOfFellowship}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {graduate.nameOfChapterPastor}
                                </p>
                              </div>
                            </TableCell>
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
                                  Awaiting Registration
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>
                                  {new Date(
                                    graduate.createdAt
                                  ).toLocaleDateString()}
                                </p>
                                {graduate.registeredAt && (
                                  <p className="text-xs text-muted-foreground">
                                    Registered:{" "}
                                    {new Date(
                                      graduate.registeredAt
                                    ).toLocaleDateString()}
                                  </p>
                                )}
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
                                  <DropdownMenuItem>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Record
                                  </DropdownMenuItem>
                                  {graduate.isRegistered && (
                                    <DropdownMenuItem>
                                      <User className="w-4 h-4 mr-2" />
                                      View Full Profile
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
        </Tabs>

        {/* Zone Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Zone Details: {selectedZone?.name}
              </DialogTitle>
              <DialogDescription>
                Comprehensive zone information and performance metrics
              </DialogDescription>
            </DialogHeader>

            {selectedZone && (
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  {/* Zone Status and Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          Zone Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Zone Name
                            </Label>
                            <p className="font-medium">{selectedZone.name}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Email
                            </Label>
                            <p className="flex items-center">
                              <Mail className="w-4 h-4 mr-1" />
                              {selectedZone.email}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Status
                            </Label>
                            <div className="mt-1">
                              {getStatusBadge(selectedZone)}
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
                                selectedZone.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Last Login
                            </Label>
                            <p>
                              {selectedZone.lastLogin
                                ? new Date(
                                    selectedZone.lastLogin
                                  ).toLocaleString()
                                : "Never"}
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Last Upload
                            </Label>
                            <p>
                              {selectedZone.lastUploadDate
                                ? new Date(
                                    selectedZone.lastUploadDate
                                  ).toLocaleDateString()
                                : "No uploads"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Graduate Statistics */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Graduate Statistics
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {selectedZone.totalGraduatesUploaded}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Uploaded
                          </div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedZone.registeredGraduates}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Registered
                          </div>
                        </div>
                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {selectedZone.pendingGraduates}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Pending
                          </div>
                        </div>
                      </div>

                      {selectedZone.totalGraduatesUploaded > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span>Registration Progress</span>
                            <span>
                              {Math.round(
                                (selectedZone.registeredGraduates /
                                  selectedZone.totalGraduatesUploaded) *
                                  100
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={
                              (selectedZone.registeredGraduates /
                                selectedZone.totalGraduatesUploaded) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Uploads for this Zone */}
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Upload className="w-4 h-4 mr-2" />
                        Recent Upload History
                      </h3>
                      <div className="space-y-3">
                        {uploads.filter(
                          (upload) => upload.zoneId === selectedZone.id
                        ).length === 0 ? (
                          <p className="text-muted-foreground text-sm">
                            No uploads from this zone yet.
                          </p>
                        ) : (
                          uploads
                            .filter(
                              (upload) => upload.zoneId === selectedZone.id
                            )
                            .slice(0, 5)
                            .map((upload) => (
                              <div
                                key={upload.id}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {upload.filename}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {upload.successfulRecords} of{" "}
                                    {upload.totalRecords} records successful
                                  </p>
                                </div>
                                <div className="text-right">
                                  {getUploadStatusBadge(upload.status)}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(
                                      upload.uploadDate
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailModalOpen(false)}
                    >
                      Close
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Full Analytics
                    </Button>
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Zone
                    </Button>
                    {selectedZone.isDeactivated ? (
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activate Zone
                      </Button>
                    ) : (
                      <Button variant="destructive">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Deactivate Zone
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
