// src/app/dashboard/vgss-office/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { UserDetailModal } from "@/components/admin/user-detail-modal";
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
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Shield,
  Building,
  GraduationCap,
  Eye,
  Edit,
  Key,
  UserX,
  UserCheck,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  type: "VGSS_OFFICE" | "BLW_ZONE" | "MINISTRY_OFFICE" | "GRADUATE";
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface UserStats {
  total: number;
  active: number;
  pending: number;
  deactivated: number;
  byType: {
    VGSS_OFFICE: number;
    BLW_ZONE: number;
    MINISTRY_OFFICE: number;
    GRADUATE: number;
  };
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    pending: 0,
    deactivated: 0,
    byType: { VGSS_OFFICE: 0, BLW_ZONE: 0, MINISTRY_OFFICE: 0, GRADUATE: 0 },
  });

  // Load users from API
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (selectedUserType !== "all") params.append("type", selectedUserType);
      if (selectedStatus !== "all") params.append("status", selectedStatus);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load users");
      }

      setUsers(data.users);
      setStats(data.stats);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    // Filter users locally for immediate UI response
    let filtered = users;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedUserType !== "all") {
      filtered = filtered.filter((user) => user.type === selectedUserType);
    }

    if (selectedStatus !== "all") {
      if (selectedStatus === "active") {
        filtered = filtered.filter(
          (user) => user.accountStatus === "active" && !user.isDeactivated
        );
      } else if (selectedStatus === "pending") {
        filtered = filtered.filter(
          (user) => user.accountStatus === "pending_activation"
        );
      } else if (selectedStatus === "deactivated") {
        filtered = filtered.filter((user) => user.isDeactivated);
      }
    }

    setFilteredUsers(filtered);
    setSelectedUsers([]); // Clear selections when filters change
  }, [users, searchQuery, selectedUserType, selectedStatus]);

  const handleSearch = () => {
    loadUsers(); // Reload with API search
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "VGSS_OFFICE":
        return Shield;
      case "BLW_ZONE":
        return Building;
      case "MINISTRY_OFFICE":
        return Building;
      case "GRADUATE":
        return GraduationCap;
      default:
        return Users;
    }
  };

  const getUserTypeBadge = (type: string) => {
    const colors = {
      VGSS_OFFICE: "bg-purple-100 text-purple-800 border-purple-200",
      BLW_ZONE: "bg-blue-100 text-blue-800 border-blue-200",
      MINISTRY_OFFICE: "bg-green-100 text-green-800 border-green-200",
      GRADUATE: "bg-orange-100 text-orange-800 border-orange-200",
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || ""}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

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
          Pending Activation
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

  const handleUserAction = async (action: string, userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      // Update user in local state
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? data.user : user))
      );

      const actionMessages = {
        toggle_activation: data.user.isDeactivated
          ? "User account deactivated"
          : "User account activated",
        reset_password: "Password reset successfully",
      };

      toast.success(
        actionMessages[action as keyof typeof actionMessages] ||
          "Action completed"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error("Please select users first");
      return;
    }

    try {
      const response = await fetch("/api/admin/users/bulk-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userIds: selectedUsers }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bulk action failed");
      }

      await loadUsers(); // Reload users
      setSelectedUsers([]);
      toast.success(`${data.message} - ${data.updatedCount} users updated`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Bulk action failed"
      );
    }
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setSelectedUser(updatedUser); // Update modal data
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id));
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
    filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;

  const isSomeSelected =
    selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length;

  return (
    <DashboardLayout title="User Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage all users across the VGSS platform
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={loadUsers} disabled={isLoading}>
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/dashboard/vgss-office/create-account">
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-green-600" />
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
                <Key className="w-5 h-5 text-yellow-600" />
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
                <UserX className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Deactivated</p>
                  <p className="text-2xl font-bold">{stats.deactivated}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Type Tabs */}
        <Tabs
          value={selectedUserType}
          onValueChange={setSelectedUserType}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Users ({stats.total})</TabsTrigger>
            <TabsTrigger value="VGSS_OFFICE">
              <Shield className="w-4 h-4 mr-2" />
              VGSS Office ({stats.byType.VGSS_OFFICE})
            </TabsTrigger>
            <TabsTrigger value="BLW_ZONE">
              <Building className="w-4 h-4 mr-2" />
              BLW Zones ({stats.byType.BLW_ZONE})
            </TabsTrigger>
            <TabsTrigger value="MINISTRY_OFFICE">
              <Building className="w-4 h-4 mr-2" />
              Ministries ({stats.byType.MINISTRY_OFFICE})
            </TabsTrigger>
            <TabsTrigger value="GRADUATE">
              <GraduationCap className="w-4 h-4 mr-2" />
              Graduates ({stats.byType.GRADUATE})
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
                          <Button variant="outline" size="sm">
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
                          <Button variant="outline" size="sm">
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
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSearch()
                          }
                          className="pl-10"
                        />
                      </div>
                      <Button onClick={handleSearch} disabled={isLoading}>
                        Search
                      </Button>
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
                                ref.indeterminate = isSomeSelected;
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
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : filteredUsers.length === 0 ? (
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
                        filteredUsers.map((user) => {
                          const TypeIcon = getUserTypeIcon(user.type);
                          const isSelected = selectedUsers.includes(user.id);

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
                                {getUserTypeBadge(user.type)}
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
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                {user.lastLogin ? (
                                  <div className="text-sm">
                                    <p>
                                      {new Date(
                                        user.lastLogin
                                      ).toLocaleDateString()}
                                    </p>
                                    <p className="text-muted-foreground">
                                      {new Date(
                                        user.lastLogin
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

                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredUsers.length} user
                      {filteredUsers.length !== 1 ? "s" : ""}
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
          onUserUpdated={handleUserUpdated}
        />
      </div>
    </DashboardLayout>
  );
}

// User Management Table Component
interface UserManagementTableProps {
  users: User[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedUserType: string;
  onUserTypeChange: (type: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onUserAction: (action: string, userId: string) => void;
  onUserSelect: (user: User) => void;
  getUserTypeIcon: (type: string) => any;
  getUserTypeBadge: (type: string) => JSX.Element;
  getStatusBadge: (user: User) => JSX.Element;
  hideUserTypeFilter?: boolean;
}

function UserManagementTable({
  users,
  isLoading,
  searchQuery,
  onSearchChange,
  selectedUserType,
  onUserTypeChange,
  selectedStatus,
  onStatusChange,
  onUserAction,
  onUserSelect,
  getUserTypeIcon,
  getUserTypeBadge,
  getStatusBadge,
  hideUserTypeFilter = false,
}: UserManagementTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2" />
          User List
        </CardTitle>
        <CardDescription>
          Manage user accounts, permissions, and activation status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Label htmlFor="search" className="sr-only">
              Search users
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {!hideUserTypeFilter && (
            <Select value={selectedUserType} onValueChange={onUserTypeChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="VGSS_OFFICE">VGSS Office</SelectItem>
                <SelectItem value="BLW_ZONE">BLW Zone</SelectItem>
                <SelectItem value="MINISTRY_OFFICE">Ministry Office</SelectItem>
                <SelectItem value="GRADUATE">Graduate</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={selectedStatus} onValueChange={onStatusChange}>
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
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No users found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  const TypeIcon = getUserTypeIcon(user.type);
                  return (
                    <TableRow key={user.id} className="hover:bg-muted/50">
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
                      <TableCell>{getUserTypeBadge(user.type)}</TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                          <p className="text-muted-foreground">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <div className="text-sm">
                            <p>
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </p>
                            <p className="text-muted-foreground">
                              {new Date(user.lastLogin).toLocaleTimeString()}
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
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onUserSelect(user)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onUserAction("reset-password", user.id)
                              }
                            >
                              <Key className="w-4 h-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.isDeactivated ? (
                              <DropdownMenuItem
                                onClick={() =>
                                  onUserAction("activate", user.id)
                                }
                                className="text-green-600"
                              >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Activate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() =>
                                  onUserAction("deactivate", user.id)
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

        {users.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {users.length} user{users.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
