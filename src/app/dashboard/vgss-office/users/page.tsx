// src/app/dashboard/vgss-office/users/page.tsx - OPTIMIZED with React Query
"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { UserDetailModal } from "@/components/admin/user-detail-modal";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Shield,
  Building,
  GraduationCap,
  Eye,
  Key,
  UserX,
  UserCheck,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import {
  useUserManagement,
  useUser,
  type User,
} from "@/hooks/use-user-management";
// import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function OptimizedUserManagementPage() {
  // State for filters and selections
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Use the optimized hook
  const {
    users,
    stats,
    pagination,
    isLoading,
    isRefreshing,
    isError,
    error,
    refetch,
    performUserAction,
    performBulkAction,
    isPerformingAction,
    isPerformingBulkAction,
  } = useUserManagement({
    search: debouncedSearchQuery,
    type: selectedUserType,
    status: selectedStatus,
    page: currentPage,
    limit: 50,
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedUsers([]);
  }, [debouncedSearchQuery, selectedUserType, selectedStatus]);

  // Memoized user type configurations
  const userTypeConfigs = useMemo(
    () => ({
      VGSS_OFFICE: {
        icon: Shield,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      },
      BLW_ZONE: {
        icon: Building,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      },
      SERVICE_DEPARTMENT: {
        icon: Building,
        color: "text-green-600",
        bgColor: "bg-green-100",
        badgeColor: "bg-green-100 text-green-800 border-green-200",
      },
      GRADUATE: {
        icon: GraduationCap,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
      },
    }),
    []
  );

  const getUserTypeIcon = (type: string) =>
    userTypeConfigs[type as keyof typeof userTypeConfigs]?.icon || Users;
  const getUserTypeBadge = (type: string) =>
    userTypeConfigs[type as keyof typeof userTypeConfigs]?.badgeColor || "";

  const getStatusBadge = (user: User) => {
    if (user.isDeactivated) {
      return (
        <Badge variant="destructive">
          <UserX className="w-3 h-3 mr-1" />
          Deactivated
        </Badge>
      );
    }

    if (user.accountStatus === "pending_activation") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Key className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  const formatLastLogin = (lastLoginAt?: string) => {
    if (!lastLoginAt) {
      return {
        text: "Never",
        className: "text-muted-foreground",
        relative: "Never logged in",
      };
    }

    const lastLogin = new Date(lastLoginAt);
    const now = new Date();
    const diffInMs = now.getTime() - lastLogin.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let relative = "";
    let className = "";

    if (diffInMinutes < 60) {
      relative = `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      className = "text-green-600";
    } else if (diffInHours < 24) {
      relative = `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
      className = "text-green-600";
    } else if (diffInDays < 7) {
      relative = `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
      className = "text-blue-600";
    } else if (diffInDays < 30) {
      relative = `${Math.floor(diffInDays / 7)} week${
        Math.floor(diffInDays / 7) !== 1 ? "s" : ""
      } ago`;
      className = "text-yellow-600";
    } else {
      relative = `${Math.floor(diffInDays / 30)} month${
        Math.floor(diffInDays / 30) !== 1 ? "s" : ""
      } ago`;
      className = "text-red-600";
    }

    return {
      text: lastLogin.toLocaleDateString(),
      time: lastLogin.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      className,
      relative,
    };
  };

  const handleUserAction = async (action: string, userId: string) => {
    performUserAction({ userId, action });
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    performBulkAction({ action, userIds: selectedUsers });
    setSelectedUsers([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const isAllSelected =
    users.length > 0 && selectedUsers.length === users.length;
  const isSomeSelected =
    selectedUsers.length > 0 && selectedUsers.length < users.length;

  // Stats cards data
  const statsCards = [
    {
      title: "Total Users",
      value: stats?.total || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "All user accounts",
    },
    {
      title: "Active Users",
      value: stats?.active || 0,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Currently active",
    },
    {
      title: "Pending Activation",
      value: stats?.pending || 0,
      icon: Key,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      description: "Awaiting activation",
    },
    {
      title: "Deactivated",
      value: stats?.deactivated || 0,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100",
      description: "Deactivated accounts",
    },
  ];

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row items-center justify-between">
          <div className=" text-center md:text-left">
            <h1 className="text-2xl font-bold ">User Management</h1>
            <p className="text-muted-foreground">
              Manage all users across the VGSS platform
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                /* Export functionality */
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
            <Link href="/dashboard/vgss-office/create-account">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load user data. Please try refreshing the page.
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

        {/* User Type Tabs */}
        <Tabs
          value={selectedUserType}
          onValueChange={setSelectedUserType}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 flex-col sm:flex-row h-fit">
            <TabsTrigger value="all">
              All Users ({stats?.total || 0})
            </TabsTrigger>
            <TabsTrigger value="VGSS_OFFICE">
              <Shield className="w-4 h-4 mr-2" />
              VGSS Office ({stats?.byType.VGSS_OFFICE || 0})
            </TabsTrigger>
            <TabsTrigger value="BLW_ZONE">
              <Building className="w-4 h-4 mr-2" />
              BLW Zones ({stats?.byType.BLW_ZONE || 0})
            </TabsTrigger>
            <TabsTrigger value="SERVICE_DEPARTMENT">
              <Building className="w-4 h-4 mr-2" />
              Ministries ({stats?.byType.SERVICE_DEPARTMENT || 0})
            </TabsTrigger>
            <TabsTrigger value="GRADUATE">
              <GraduationCap className="w-4 h-4 mr-2" />
              Graduates ({stats?.byType.GRADUATE || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedUserType} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      User List
                    </CardTitle>
                    <CardDescription>
                      Manage user accounts, permissions, and activation status
                    </CardDescription>
                  </div>

                  {/* Bulk Actions */}
                  {selectedUsers.length > 0 && (
                    <div className="flex space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPerformingBulkAction}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate Selected ({selectedUsers.length})
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Activate Selected Users
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to activate{" "}
                              {selectedUsers.length} selected users?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleBulkAction("activate")}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Activate Users
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPerformingBulkAction}
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Deactivate Selected
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Deactivate Selected Users
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to deactivate{" "}
                              {selectedUsers.length} selected users?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleBulkAction("deactivate")}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Deactivate Users
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="search" className="sr-only">
                      Search users
                    </Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="search"
                          placeholder="Search by name or email..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
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
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="deactivated">Deactivated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
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
                                // ref.indeterminate = isSomeSelected;
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Login</TableHead>
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
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div>
                                  <Skeleton className="h-4 w-32 mb-1" />
                                  <Skeleton className="h-3 w-48" />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-8 w-8 ml-auto" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium mb-2">
                              No users found
                            </h3>
                            <p className="text-muted-foreground">
                              Try adjusting your search or filter criteria.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user) => {
                          const TypeIcon = getUserTypeIcon(user.type);
                          const isSelected = selectedUsers.includes(user.id);
                          const lastLoginInfo = formatLastLogin(
                            user.lastLoginAt
                          );

                          return (
                            <TableRow
                              key={user.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleSelectUser(
                                      user.id,
                                      checked as boolean
                                    )
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <TypeIcon className="w-4 h-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getUserTypeBadge(user.type)}>
                                  {user.type.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(user)}</TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p>
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-muted-foreground">
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  <p className={lastLoginInfo.className}>
                                    {lastLoginInfo.text}
                                  </p>
                                  {lastLoginInfo.time && (
                                    <p className="text-muted-foreground">
                                      {lastLoginInfo.time}
                                    </p>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {lastLoginInfo.relative}
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
                                      User Actions
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => setSelectedUser(user)}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUserAction(
                                          "reset_password",
                                          user.id
                                        )
                                      }
                                    >
                                      <Key className="w-4 h-4 mr-2" />
                                      Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {user.isDeactivated ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUserAction(
                                            "toggle_activation",
                                            user.id
                                          )
                                        }
                                        className="text-green-600"
                                      >
                                        <UserCheck className="w-4 h-4 mr-2" />
                                        Activate User
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUserAction(
                                            "toggle_activation",
                                            user.id
                                          )
                                        }
                                        className="text-red-600"
                                      >
                                        <UserX className="w-4 h-4 mr-2" />
                                        Deactivate User
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
                      of {pagination.total} users
                      {selectedUsers.length > 0 && (
                        <span className="ml-2 font-medium">
                          ({selectedUsers.length} selected)
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
                            const pageNumber = i + 1;
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

                        {pagination.totalPages > 5 && (
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

                {users.length > 0 && !pagination && (
                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {users.length} user{users.length !== 1 ? "s" : ""}
                      {selectedUsers.length > 0 && (
                        <span className="ml-2 font-medium">
                          ({selectedUsers.length} selected)
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdated={(updatedUser) => {
            // The React Query cache will be updated automatically by the mutation
            setSelectedUser(updatedUser);
          }}
        />
      </div>
    </DashboardLayout>
  );
}
