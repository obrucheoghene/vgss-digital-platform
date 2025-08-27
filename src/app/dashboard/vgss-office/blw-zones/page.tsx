// src/app/dashboard/vgss-office/zones/page.tsx
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
import { Progress } from "@/components/ui/progress";
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
  Loader2,
  Mail,
  AlertCircle,
  Activity,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { BLWZoneUser, useBlwZoneUsers } from "@/hooks/use-blw-zones";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<BLWZoneUser | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("zones");
  const itemsPerPage = 15;
  const blwzoneUsers = useBlwZoneUsers();
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
  // Filter zones
  const filteredZones = useMemo(
    () =>
      (blwzoneUsers?.data?.results || []).filter((zone: BLWZoneUser) => {
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
      }) || [],
    [searchQuery, selectedStatus, blwzoneUsers?.data?.results]
  );

  // Get status badge
  const getStatusBadge = (zone: BLWZoneUser) => {
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
            {/* <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              onClick={() => window.location.reload()}
              disabled={blwzoneUsers.isLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  blwzoneUsers.isLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button> */}
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
                        {/* <TableHead>Recent Activity</TableHead> */}
                        <TableHead>Last Login</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blwzoneUsers.isLoading ? (
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
                        paginatedZones.map((zone: BLWZoneUser) => (
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
                              {zone.totalGraduatesUploaded ? (
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
                                    {zone.totalGraduatesUploaded -
                                      zone.registeredGraduates}{" "}
                                    pending
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
                              ) : (
                                <>-</>
                              )}
                            </TableCell>
                            {/* <TableCell>
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
                            </TableCell> */}
                            <TableCell>
                              {zone.lastLoginAt ? (
                                <div className="text-sm">
                                  <p>
                                    {new Date(
                                      zone.lastLoginAt
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(
                                      zone.lastLoginAt
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
                              {selectedZone.lastLoginAt
                                ? new Date(
                                    selectedZone.lastLoginAt
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
                            {selectedZone.totalGraduatesUploaded -
                              selectedZone.registeredGraduates}
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
