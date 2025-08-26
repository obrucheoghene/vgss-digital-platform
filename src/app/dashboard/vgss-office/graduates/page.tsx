/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/vgss-office/graduates/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { GraduateDetailModal } from "@/components/admin/graduate-detail-modal";
import { StatsCard } from "@/components/dashboard/stats-card";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  GraduationCap,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  MessageSquare,
  Award,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Star,
  Building,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import {
  useGraduateManagement,
  type Graduate,
} from "@/hooks/use-graduate-management";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function GraduateManagementPage() {
  // State for filters and selections
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [selectedGraduate, setSelectedGraduate] = useState<Graduate | null>(
    null
  );
  const [selectedGraduates, setSelectedGraduates] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk action dialog states
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false);
  const [bulkActionType, setBulkActionType] = useState<string>("");
  const [bulkComments, setBulkComments] = useState("");
  const [bulkActionStatus, setBulkActionStatus] = useState<string>("");

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use the graduate management hook
  const {
    graduates,
    stats,
    zones,
    pagination,
    isLoading,
    isRefreshing,
    isError,
    error,
    refetch,
    performAction,
    performBulkAction,
    isPerformingAction,
    isPerformingBulkAction,
  } = useGraduateManagement({
    search: debouncedSearchQuery,
    status: selectedStatus,
    zone: selectedZone,
    gender: selectedGender,
    page: currentPage,
    limit: 50,
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedGraduates([]);
  }, [debouncedSearchQuery, selectedStatus, selectedZone, selectedGender]);

  // Status configurations
  const statusConfigs = {
    "Under Review": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: Clock,
      iconColor: "text-yellow-600",
    },
    "Invited For Interview": {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: MessageSquare,
      iconColor: "text-blue-600",
    },
    Interviewed: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: CheckCircle,
      iconColor: "text-purple-600",
    },
    Sighting: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: Eye,
      iconColor: "text-orange-600",
    },
    Serving: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: Award,
      iconColor: "text-green-600",
    },
    "Not Accepted": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
      iconColor: "text-red-600",
    },
  };

  const getStatusBadge = (status: Graduate["status"]) => {
    const config = statusConfigs[status];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getGenderBadge = (gender: "MALE" | "FEMALE") => {
    return (
      <Badge variant={gender === "MALE" ? "outline" : "secondary"}>
        {gender}
      </Badge>
    );
  };

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleGraduateAction = async (
    action: string,
    graduateId: string,
    data?: any
  ) => {
    performAction({ graduateId, action, data });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedGraduates.length === 0) {
      toast.error("Please select graduates first");
      return;
    }

    const actionData: any = {};
    if (bulkComments) actionData.comments = bulkComments;
    if (bulkActionStatus) actionData.status = bulkActionStatus;

    performBulkAction({
      action,
      graduateIds: selectedGraduates,
      data: actionData,
    });
    setSelectedGraduates([]);
    setShowBulkActionDialog(false);
    setBulkComments("");
    setBulkActionStatus("");
  };

  const openBulkActionDialog = (actionType: string) => {
    setBulkActionType(actionType);
    setShowBulkActionDialog(true);
    setBulkComments("");
    setBulkActionStatus("");
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGraduates(graduates.map((graduate) => graduate.id));
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

  const isAllSelected =
    graduates.length > 0 && selectedGraduates.length === graduates.length;
  const isSomeSelected =
    selectedGraduates.length > 0 && selectedGraduates.length < graduates.length;

  // Stats cards data
  const statsCards = [
    {
      title: "Total Graduates",
      value: stats?.total || 0,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Registered graduates",
    },
    {
      title: "Approved",
      value: stats?.approved || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Approved for service",
    },
    {
      title: "Under Review",
      value: stats?.byStatus?.["Under Review"] || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Pending review",
    },
    {
      title: "Currently Serving",
      value: stats?.byStatus?.["Serving"] || 0,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Active in service",
    },
  ];

  const statusOptions = [
    { value: "Under Review", label: "Under Review" },
    { value: "Invited For Interview", label: "Invited For Interview" },
    { value: "Interviewed", label: "Interviewed" },
    { value: "Sighting", label: "Sighting" },
    { value: "Serving", label: "Serving" },
    { value: "Not Accepted", label: "Not Accepted" },
  ];

  const getBulkActionTitle = (actionType: string) => {
    const titles = {
      approve_selected: "Approve Selected Graduates",
      reject_selected: "Reject Selected Graduates",
      update_status: "Update Status for Selected Graduates",
      invite_for_interview: "Invite Selected Graduates for Interview",
      mark_interviewed: "Mark Selected Graduates as Interviewed",
    };
    return titles[actionType as keyof typeof titles] || "Bulk Action";
  };

  const getBulkActionDescription = (actionType: string) => {
    const descriptions = {
      approve_selected: `You are about to approve ${selectedGraduates.length} selected graduate(s) for VGSS service.`,
      reject_selected: `You are about to reject ${selectedGraduates.length} selected graduate(s). They will be marked as "Not Accepted".`,
      update_status: `You are about to update the status of ${selectedGraduates.length} selected graduate(s).`,
      invite_for_interview: `You are about to invite ${selectedGraduates.length} selected graduate(s) for interview.`,
      mark_interviewed: `You are about to mark ${selectedGraduates.length} selected graduate(s) as interviewed.`,
    };
    return (
      descriptions[actionType as keyof typeof descriptions] ||
      "This action will affect multiple graduates."
    );
  };

  return (
    <DashboardLayout title="Graduate Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Graduate Management</h1>
            <p className="text-muted-foreground">
              Review, approve, and manage VGSS graduate applications
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export functionality - could implement CSV/Excel export
                toast.info("Export feature coming soon!");
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            {/* <Button onClick={refetch} disabled={isRefreshing}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button> */}
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load graduate data. Please try refreshing the page.
              {/* <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                className="ml-2"
              >
                Retry
              </Button> */}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              description={stat.description}
              loading={isLoading}
            />
          ))}
        </div>

        {/* Status Distribution */}
        {stats && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Status Distribution
              </CardTitle>
              <CardDescription>
                Current status of all graduates in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                {Object.entries(stats.byStatus).map(([status, count]) => {
                  const config =
                    statusConfigs[status as keyof typeof statusConfigs];
                  const Icon = config?.icon || Clock;

                  return (
                    <div
                      key={status}
                      className="text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedStatus(status)}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Icon
                          className={`w-5 h-5 ${
                            config?.iconColor || "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {count}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Tabs */}
        <Tabs
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All ({stats?.total || 0})</TabsTrigger>
            <TabsTrigger value="Under Review">
              <Clock className="w-4 h-4 mr-1" />
              Review ({stats?.byStatus?.["Under Review"] || 0})
            </TabsTrigger>
            <TabsTrigger value="Invited For Interview">
              <MessageSquare className="w-4 h-4 mr-1" />
              Interview ({stats?.byStatus?.["Invited For Interview"] || 0})
            </TabsTrigger>
            <TabsTrigger value="Interviewed">
              <CheckCircle className="w-4 h-4 mr-1" />
              Interviewed ({stats?.byStatus?.["Interviewed"] || 0})
            </TabsTrigger>
            <TabsTrigger value="Sighting">
              <Eye className="w-4 h-4 mr-1" />
              Sighting ({stats?.byStatus?.["Sighting"] || 0})
            </TabsTrigger>
            <TabsTrigger value="Serving">
              <Award className="w-4 h-4 mr-1" />
              Serving ({stats?.byStatus?.["Serving"] || 0})
            </TabsTrigger>
            <TabsTrigger value="Not Accepted">
              <XCircle className="w-4 h-4 mr-1" />
              Rejected ({stats?.byStatus?.["Not Accepted"] || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedStatus} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Graduates List
                    </CardTitle>
                    <CardDescription>
                      Review and manage graduate applications and status
                    </CardDescription>
                  </div>

                  {/* Bulk Actions */}
                  {selectedGraduates.length > 0 && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openBulkActionDialog("approve_selected")}
                        disabled={isPerformingBulkAction}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve ({selectedGraduates.length})
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openBulkActionDialog("reject_selected")}
                        disabled={isPerformingBulkAction}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject ({selectedGraduates.length})
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPerformingBulkAction}
                          >
                            <Filter className="w-4 h-4 mr-2" />
                            More Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() =>
                              openBulkActionDialog("invite_for_interview")
                            }
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Invite for Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openBulkActionDialog("mark_interviewed")
                            }
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Interviewed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openBulkActionDialog("update_status")
                            }
                          >
                            <ArrowUpDown className="w-4 h-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search graduates
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search by name, email, university, or fellowship..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {zones.map((zone) => (
                        <SelectItem key={zone} value={zone}>
                          {zone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedGender}
                    onValueChange={setSelectedGender}
                  >
                    <SelectTrigger className="w-full lg:w-32">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
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
                              if (ref) {
                                ref.indeterminate = isSomeSelected;
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Graduate</TableHead>
                        <TableHead>Education</TableHead>
                        <TableHead>Ministry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-4" />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div>
                                  <Skeleton className="h-4 w-32 mb-1" />
                                  <Skeleton className="h-3 w-48" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-8" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : graduates.length === 0 ? (
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
                        graduates.map((graduate) => {
                          const isSelected = selectedGraduates.includes(
                            graduate.id
                          );
                          const age = calculateAge(graduate.dateOfBirth);

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
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                  </div>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <p className="font-medium">
                                        {graduate.graduateName}
                                      </p>
                                      {graduate.isApproved && (
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground flex items-center">
                                      <Mail className="w-3 h-3 mr-1" />
                                      {graduate.email}
                                    </p>
                                    <p className="text-xs text-muted-foreground flex items-center">
                                      <Phone className="w-3 h-3 mr-1" />
                                      {graduate.graduatePhoneNumber}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p className="font-medium">
                                    {graduate.nameOfUniversity}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {graduate.courseOfStudy}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {graduate.graduationYear} • {graduate.grade}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <div className="flex items-center text-muted-foreground mb-1">
                                    <Building className="w-3 h-3 mr-1" />
                                    <p className="font-medium">
                                      {graduate.nameOfZone}
                                    </p>
                                  </div>
                                  <p className="text-muted-foreground">
                                    {graduate.nameOfFellowship}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {graduate.nameOfChapterPastor}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {getStatusBadge(graduate.status)}
                                  {getGenderBadge(graduate.graduateGender)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm font-medium">
                                  {age}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-muted-foreground">
                                  <p>
                                    {new Date(
                                      graduate.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs">
                                    {new Date(
                                      graduate.createdAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      disabled={isPerformingAction}
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                      Graduate Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() =>
                                        setSelectedGraduate(graduate)
                                      }
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {!graduate.isApproved && (
                                      <>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleGraduateAction(
                                              "approve",
                                              graduate.id
                                            )
                                          }
                                          className="text-green-600"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleGraduateAction(
                                              "reject",
                                              graduate.id,
                                              {
                                                comments:
                                                  "Application rejected",
                                              }
                                            )
                                          }
                                          className="text-red-600"
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Reject
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                      </>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleGraduateAction(
                                          "update_status",
                                          graduate.id,
                                          {
                                            status: "Invited For Interview",
                                          }
                                        )
                                      }
                                    >
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Invite for Interview
                                    </DropdownMenuItem>
                                    {graduate.status === "Serving" &&
                                      !graduate.serviceCompletedDate && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleGraduateAction(
                                              "complete_service",
                                              graduate.id
                                            )
                                          }
                                        >
                                          <Award className="w-4 h-4 mr-2" />
                                          Complete Service
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
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
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

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1 || isLoading}
                      >
                        Previous
                      </Button>

                      <div className="flex items-center space-x-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            let pageNumber;
                            if (pagination.totalPages <= 5) {
                              pageNumber = i + 1;
                            } else if (currentPage <= 3) {
                              pageNumber = i + 1;
                            } else if (
                              currentPage >=
                              pagination.totalPages - 2
                            ) {
                              pageNumber = pagination.totalPages - 4 + i;
                            } else {
                              pageNumber = currentPage - 2 + i;
                            }

                            return (
                              <Button
                                key={pageNumber}
                                variant={
                                  currentPage === pageNumber
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNumber)}
                                disabled={isLoading}
                                className="w-8 h-8 p-0"
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )}

                        {pagination.totalPages > 5 &&
                          currentPage < pagination.totalPages - 2 && (
                            <>
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage(pagination.totalPages)
                                }
                                disabled={
                                  isLoading ||
                                  currentPage === pagination.totalPages
                                }
                                className="w-8 h-8 p-0"
                              >
                                {pagination.totalPages}
                              </Button>
                            </>
                          )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage(
                            Math.min(pagination.totalPages, currentPage + 1)
                          )
                        }
                        disabled={
                          currentPage === pagination.totalPages || isLoading
                        }
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {/* Results summary for single page */}
                {(!pagination || pagination.totalPages <= 1) &&
                  graduates.length > 0 && (
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        Showing {graduates.length} graduate
                        {graduates.length !== 1 ? "s" : ""}
                        {selectedGraduates.length > 0 && (
                          <span className="ml-2 font-medium">
                            ({selectedGraduates.length} selected)
                          </span>
                        )}
                      </p>
                    </div>
                  )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bulk Action Dialog */}
        <Dialog
          open={showBulkActionDialog}
          onOpenChange={setShowBulkActionDialog}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{getBulkActionTitle(bulkActionType)}</DialogTitle>
              <DialogDescription>
                {getBulkActionDescription(bulkActionType)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Status Selection for update_status action */}
              {bulkActionType === "update_status" && (
                <div>
                  <Label htmlFor="bulk-status">New Status</Label>
                  <Select
                    value={bulkActionStatus}
                    onValueChange={setBulkActionStatus}
                  >
                    <SelectTrigger id="bulk-status">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Comments */}
              <div>
                <Label htmlFor="bulk-comments">
                  Comments{" "}
                  {bulkActionType === "reject_selected"
                    ? "(Required)"
                    : "(Optional)"}
                </Label>
                <Textarea
                  id="bulk-comments"
                  placeholder="Add comments about this action..."
                  value={bulkComments}
                  onChange={(e) => setBulkComments(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Warning for rejection */}
              {bulkActionType === "reject_selected" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warning:</strong> Rejecting graduates will mark them
                    as {"Not Accepted"}
                    and they will no longer be eligible for VGSS service. This
                    action cannot be easily undone.
                  </AlertDescription>
                </Alert>
              )}

              {/* Info for status updates */}
              {bulkActionType === "update_status" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will update the status for all selected graduates to
                    the chosen status. Make sure this is the intended action.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowBulkActionDialog(false);
                  setBulkComments("");
                  setBulkActionStatus("");
                }}
                disabled={isPerformingBulkAction}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleBulkAction(bulkActionType)}
                disabled={
                  isPerformingBulkAction ||
                  (bulkActionType === "update_status" && !bulkActionStatus) ||
                  (bulkActionType === "reject_selected" && !bulkComments.trim())
                }
                className={cn(
                  bulkActionType === "reject_selected"
                    ? "bg-red-600 hover:bg-red-700"
                    : bulkActionType === "approve_selected"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                )}
              >
                {isPerformingBulkAction && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Confirm Action
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Graduate Detail Modal */}
        {selectedGraduate && (
          <GraduateDetailModal
            graduate={selectedGraduate}
            isOpen={!!selectedGraduate}
            onClose={() => setSelectedGraduate(null)}
            onGraduateUpdated={(updatedGraduate) => {
              // React Query will automatically update the cache
              // We just need to update the selected graduate for the modal
              setSelectedGraduate(updatedGraduate);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
