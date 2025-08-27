// src/components/admin/user-detail-modal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  User,
  Shield,
  Building,
  GraduationCap,
  Calendar,
  Mail,
  Key,
  UserX,
  UserCheck,
  Edit3,
  Save,
  X,
  AlertTriangle,
  Clock,
  Users,
  Loader2,
  CheckCircle,
} from "lucide-react";

interface UserData {
  id: string;
  name: string;
  email: string;
  type: "VGSS_OFFICE" | "BLW_ZONE" | "SERVICE_DEPARTMENT" | "GRADUATE";
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastLogin?: string;
}

interface UserDetailModalProps {
  user: UserData | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (updatedUser: UserData) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onUserUpdated,
}: UserDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  // Reset state when user changes or modal opens/closes
  useEffect(() => {
    if (user && isOpen) {
      setEditForm({
        name: user.name,
        email: user.email,
      });
      setIsEditing(false);
      setError("");
      setSuccess("");
    }
  }, [user, isOpen]);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  if (!user) return null;

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "VGSS_OFFICE":
        return Shield;
      case "BLW_ZONE":
        return Building;
      case "SERVICE_DEPARTMENT":
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
      SERVICE_DEPARTMENT: "bg-green-100 text-green-800 border-green-200",
      GRADUATE: "bg-orange-100 text-orange-800 border-orange-200",
    };

    return (
      <Badge className={colors[type as keyof typeof colors] || ""}>
        {type.replace("_", " ")}
      </Badge>
    );
  };

  const getStatusInfo = () => {
    if (user.isDeactivated) {
      return {
        badge: (
          <Badge variant="destructive">
            <UserX className="w-3 h-3 mr-1" />
            Deactivated
          </Badge>
        ),
        description: "This account has been deactivated and cannot log in.",
        canActivate: true,
      };
    }

    if (user.accountStatus === "pending_activation") {
      return {
        badge: (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Key className="w-3 h-3 mr-1" />
            Pending Activation
          </Badge>
        ),
        description:
          "User needs to activate their account by setting a password.",
        canActivate: false,
      };
    }

    return {
      badge: (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <UserCheck className="w-3 h-3 mr-1" />
          Active
        </Badge>
      ),
      description: "Account is active and user can log in normally.",
      canActivate: false,
    };
  };

  const handleAction = async (action: string, actionData?: any) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload: any = { action };

      // Add specific data for different actions
      if (action === "toggle_activation") {
        payload.isDeactivated = !user.isDeactivated;
      } else if (action === "update_details") {
        payload.name = editForm.name.trim();
        payload.email = editForm.email.trim();

        // Validate form data
        if (!payload.name || !payload.email) {
          throw new Error("Name and email are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
          throw new Error("Please enter a valid email address");
        }
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update user");
      }

      // Update parent component with new user data
      onUserUpdated(data.user);

      // Set success message based on action
      const actionMessages = {
        toggle_activation: data.user.isDeactivated
          ? "User account has been deactivated successfully"
          : "User account has been activated successfully",
        reset_password:
          "Password has been reset successfully. User will need to activate their account with the default password.",
        update_details: "User details have been updated successfully",
      };

      setSuccess(
        actionMessages[action as keyof typeof actionMessages] ||
          "Action completed successfully"
      );

      // Exit edit mode after successful update
      if (action === "update_details") {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("User action error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while updating the user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email,
    });
    setIsEditing(false);
    setError("");
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error when user starts typing
  };

  const TypeIcon = getUserTypeIcon(user.type);
  const statusInfo = getStatusInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground font-normal">
                {user.email}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-center space-x-2">
            {getUserTypeBadge(user.type)}
            {statusInfo.badge}
          </DialogDescription>
        </DialogHeader>

        {/* Alert Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">User Information</h3>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isLoading}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name *</Label>
                      <Input
                        id="edit-name"
                        value={editForm.name}
                        onChange={(e) =>
                          handleFormChange("name", e.target.value)
                        }
                        disabled={isLoading}
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address *</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          handleFormChange("email", e.target.value)
                        }
                        disabled={isLoading}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleAction("update_details")}
                      disabled={
                        isLoading ||
                        !editForm.name.trim() ||
                        !editForm.email.trim()
                      }
                    >
                      {isLoading && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </Label>
                      <p className="text-base font-medium mt-1">{user.name}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="text-base">{user.email}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        User Type
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        <p className="text-base">
                          {user.type.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Account Status
                      </Label>
                      <div className="space-y-2 mt-1">
                        {statusInfo.badge}
                        <p className="text-sm text-muted-foreground">
                          {statusInfo.description}
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Created Date
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-base">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Last Updated
                      </Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-base">
                            {new Date(user.updatedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.updatedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-4">
                User Activity History
              </h3>

              <div className="space-y-3">
                {user.lastLogin && (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <UserCheck className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Last Login</p>
                        <p className="text-xs text-muted-foreground">
                          User accessed the system
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Profile Updated</p>
                      <p className="text-xs text-muted-foreground">
                        User information was modified
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Account Created</p>
                      <p className="text-xs text-muted-foreground">
                        User account was established
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {!user.lastLogin && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">This user has never logged in</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                User Management Actions
              </h3>

              <div className="space-y-4">
                {/* Account Status Actions */}
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium text-base">Account Status</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {statusInfo.description}
                  </p>

                  {user.isDeactivated ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isLoading}
                        >
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activate Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Activate User Account
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to activate this user account?
                            The user will be able to log in and access the
                            system again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAction("toggle_activation")}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isLoading && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Activate Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          disabled={isLoading}
                        >
                          <UserX className="w-4 h-4 mr-2" />
                          Deactivate Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Deactivate User Account
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to deactivate this user
                            account? The user will not be able to log in until
                            reactivated.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleAction("toggle_activation")}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {isLoading && (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            )}
                            Deactivate Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

                {/* Password Management */}
                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium text-base">Password Management</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Reset the user's password to the default value and require
                    account reactivation.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={isLoading}>
                        <Key className="w-4 h-4 mr-2" />
                        Reset Password
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                          Reset User Password
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will reset the user's password to the default
                          "VgssTemp123" and require them to activate their
                          account again. The user will need to log in and set a
                          new password.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleAction("reset_password")}
                          disabled={isLoading}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          {isLoading && (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          )}
                          Reset Password
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Information Panel */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    Information
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Account changes take effect immediately</li>
                    <li>• Deactivated users cannot log in to the system</li>
                    <li>
                      • Password resets require users to reactivate their
                      accounts
                    </li>
                    <li>• All actions are logged for security purposes</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
