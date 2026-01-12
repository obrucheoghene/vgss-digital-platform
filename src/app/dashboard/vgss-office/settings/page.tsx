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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  User,
  Bell,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Save,
  RefreshCw,
  Eye,
  Activity,
  Users,
  Building,
  GraduationCap,
  UserPlus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface SystemSettings {
  general: {
    platformName: string;
    platformDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    dateFormat: string;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    graduateRegistration: boolean;
    staffRequests: boolean;
    systemAlerts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };
  security: {
    passwordMinLength: number;
    requireTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    requirePasswordChange: boolean;
    passwordExpiryDays: number;
  };
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalGraduates: number;
  totalZoneGraduates: number;
  totalZones: number;
  totalServiceDepartments: number;
  pendingStaffRequests: number;
  graduatesByStatus: Record<string, number>;
  staffRequestsByStatus: Record<string, number>;
}

interface AdminUserData {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  accountStatus: string;
  lastLogin: string | null;
  createdAt: string;
}

export default function VGSSOfficeSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      platformName: "VGSS Platform",
      platformDescription:
        "Volunteer Graduate Service Scheme Management System",
      contactEmail: "admin@vgss.loveworld.org",
      supportPhone: "+234 1 234 5678",
      timezone: "Africa/Lagos",
      dateFormat: "DD/MM/YYYY",
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      graduateRegistration: true,
      staffRequests: true,
      systemAlerts: true,
      weeklyReports: true,
      monthlyReports: true,
    },
    security: {
      passwordMinLength: 8,
      requireTwoFactor: false,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      requirePasswordChange: true,
      passwordExpiryDays: 90,
    },
  });

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUserData[]>([]);

  // System metrics state
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalGraduates: 0,
    totalZoneGraduates: 0,
    totalZones: 0,
    totalServiceDepartments: 0,
    pendingStaffRequests: 0,
    graduatesByStatus: {},
    staffRequestsByStatus: {},
  });

  // Load settings and metrics from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/vgss-office/settings");
        if (!response.ok) {
          throw new Error("Failed to load settings");
        }
        const data = await response.json();

        if (data.success) {
          setMetrics(data.metrics);
          setAdminUsers(data.adminUsers);
        }
      } catch (error) {
        toast.error("Failed to load settings data");
        console.error("Settings load error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save settings
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  // Update settings
  const updateSettings = (
    section: keyof SystemSettings,
    field: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };


  return (
    <DashboardLayout title="System Settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">
              Configure platform settings, security, and system preferences
            </p>
          </div>
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* System Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="font-semibold">
                    {metrics.activeUsers} active / {metrics.totalUsers} total
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Graduates</p>
                  <p className="font-semibold">
                    {metrics.totalGraduates} registered
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">BLW Zones</p>
                  <p className="font-semibold">{metrics.totalZones}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Building className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Service Depts</p>
                  <p className="font-semibold">{metrics.totalServiceDepartments}</p>
                </div>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid gap-4 md:grid-cols-3 mt-4 pt-4 border-t">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Staff Requests</p>
                  <p className="font-semibold">{metrics.pendingStaffRequests}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zone Graduates</p>
                  <p className="font-semibold">{metrics.totalZoneGraduates} uploaded</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="font-semibold text-green-600">Operational</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Admin Users
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure basic platform information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.general.platformName}
                      onChange={(e) =>
                        updateSettings(
                          "general",
                          "platformName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) =>
                        updateSettings(
                          "general",
                          "contactEmail",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platformDescription">
                    Platform Description
                  </Label>
                  <Textarea
                    id="platformDescription"
                    value={settings.general.platformDescription}
                    onChange={(e) =>
                      updateSettings(
                        "general",
                        "platformDescription",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="supportPhone">Support Phone</Label>
                    <Input
                      id="supportPhone"
                      value={settings.general.supportPhone}
                      onChange={(e) =>
                        updateSettings(
                          "general",
                          "supportPhone",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) =>
                        updateSettings("general", "timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lagos">
                          Africa/Lagos (WAT)
                        </SelectItem>
                        <SelectItem value="GMT">GMT</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) =>
                      updateSettings("general", "dateFormat", value)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure email and system notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable email notifications for system events
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailEnabled}
                      onCheckedChange={(checked) =>
                        updateSettings("notifications", "emailEnabled", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable SMS notifications for critical alerts
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsEnabled}
                      onCheckedChange={(checked) =>
                        updateSettings("notifications", "smsEnabled", checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Event Notifications</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Graduate Registration</Label>
                      <Switch
                        checked={settings.notifications.graduateRegistration}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            "notifications",
                            "graduateRegistration",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Staff Requests</Label>
                      <Switch
                        checked={settings.notifications.staffRequests}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            "notifications",
                            "staffRequests",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>System Alerts</Label>
                      <Switch
                        checked={settings.notifications.systemAlerts}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            "notifications",
                            "systemAlerts",
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Report Notifications</h4>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Weekly Reports</Label>
                      <Switch
                        checked={settings.notifications.weeklyReports}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            "notifications",
                            "weeklyReports",
                            checked
                          )
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Monthly Reports</Label>
                      <Switch
                        checked={settings.notifications.monthlyReports}
                        onCheckedChange={(checked) =>
                          updateSettings(
                            "notifications",
                            "monthlyReports",
                            checked
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure authentication and security policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="passwordMinLength">
                      Minimum Password Length
                    </Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      min="6"
                      max="20"
                      value={settings.security.passwordMinLength}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "passwordMinLength",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Session Timeout (hours)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="1"
                      max="168"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.requireTwoFactor}
                      onCheckedChange={(checked) =>
                        updateSettings("security", "requireTwoFactor", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Require Password Change</Label>
                      <p className="text-sm text-muted-foreground">
                        Force password change on first login
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.requirePasswordChange}
                      onCheckedChange={(checked) =>
                        updateSettings(
                          "security",
                          "requirePasswordChange",
                          checked
                        )
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "maxLoginAttempts",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lockoutDuration">
                      Lockout Duration (minutes)
                    </Label>
                    <Input
                      id="lockoutDuration"
                      type="number"
                      min="5"
                      max="120"
                      value={settings.security.lockoutDuration}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "lockoutDuration",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiryDays">
                      Password Expiry (days)
                    </Label>
                    <Input
                      id="passwordExpiryDays"
                      type="number"
                      min="30"
                      max="365"
                      value={settings.security.passwordExpiryDays}
                      onChange={(e) =>
                        updateSettings(
                          "security",
                          "passwordExpiryDays",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Users */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>VGSS Office Users</CardTitle>
                    <CardDescription>
                      Manage VGSS Office administrator accounts
                    </CardDescription>
                  </div>
                  <Button onClick={() => window.location.href = "/dashboard/vgss-office/create-account"}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No administrators found</h3>
                    <p className="text-muted-foreground">
                      Create a new VGSS Office account to get started.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Administrator</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Account Status</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
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
                              <Badge variant="outline">{user.role}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={
                                  user.accountStatus === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {user.accountStatus === "active"
                                  ? "Activated"
                                  : "Pending Activation"}
                              </Badge>
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
                                <span className="text-sm text-muted-foreground">
                                  Never
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.isActive ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Inactive
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.location.href = `/dashboard/vgss-office/users`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  );
}
