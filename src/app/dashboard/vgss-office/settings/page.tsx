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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Key,
  AlertCircle,
  CheckCircle,
  Clock,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Server,
  HardDrive,
  Wifi,
  Activity,
  FileText,
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
    currency: string;
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
  system: {
    maintenanceMode: boolean;
    debugMode: boolean;
    logLevel: string;
    backupEnabled: boolean;
    backupFrequency: string;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalGraduates: number;
  totalZones: number;
  totalOffices: number;
  systemUptime: string;
  diskUsage: number;
  memoryUsage: number;
  cpuUsage: number;
}

export default function VGSSOfficeSettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);

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
      currency: "NGN",
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
    system: {
      maintenanceMode: false,
      debugMode: false,
      logLevel: "info",
      backupEnabled: true,
      backupFrequency: "daily",
      maxFileSize: 5,
      allowedFileTypes: ["pdf", "doc", "docx", "jpg", "png", "csv", "xlsx"],
    },
  });

  // Admin users state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "System Administrator",
      email: "admin@vgss.loveworld.org",
      role: "Super Admin",
      permissions: ["all"],
      lastLogin: "2024-01-25T09:30:00Z",
      isActive: true,
    },
    {
      id: "2",
      name: "John Smith",
      email: "john.smith@vgss.loveworld.org",
      role: "Admin",
      permissions: ["user_management", "graduate_management"],
      lastLogin: "2024-01-24T14:20:00Z",
      isActive: true,
    },
    {
      id: "3",
      name: "Sarah Johnson",
      email: "sarah.johnson@vgss.loveworld.org",
      role: "Moderator",
      permissions: ["graduate_management"],
      lastLogin: "2024-01-23T11:45:00Z",
      isActive: false,
    },
  ]);

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      userId: "1",
      userName: "System Administrator",
      action: "User Created",
      details: "Created new BLW Zone account: Lagos Zone 5",
      timestamp: "2024-01-25T10:30:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    {
      id: "2",
      userId: "2",
      userName: "John Smith",
      action: "Graduate Approved",
      details: "Approved graduate: Michael Eze for service",
      timestamp: "2024-01-25T09:15:00Z",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    },
    {
      id: "3",
      userId: "1",
      userName: "System Administrator",
      action: "Settings Updated",
      details: "Updated notification settings",
      timestamp: "2024-01-24T16:45:00Z",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  ]);

  // System metrics state
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 234,
    activeUsers: 187,
    totalGraduates: 1456,
    totalZones: 45,
    totalOffices: 28,
    systemUptime: "15 days, 4 hours",
    diskUsage: 65,
    memoryUsage: 72,
    cpuUsage: 45,
  });

  // Load settings
  useEffect(() => {
    // In a real app, load settings from API
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Settings are already initialized in state
      } catch (error) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
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

  // Toggle user status
  const toggleUserStatus = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
    toast.success("User status updated");
  };

  // Handle backup
  const handleBackup = async () => {
    try {
      toast.info("Starting backup process...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success("Backup completed successfully");
      setIsBackupDialogOpen(false);
    } catch (error) {
      toast.error("Backup failed");
    }
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
          <div className="flex space-x-2">
            <Dialog
              open={isBackupDialogOpen}
              onOpenChange={setIsBackupDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Create Backup
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create System Backup</DialogTitle>
                  <DialogDescription>
                    This will create a complete backup of the system including
                    all user data, settings, and configurations.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsBackupDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleBackup}>
                    <Download className="w-4 h-4 mr-2" />
                    Start Backup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
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
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Status</p>
                  <p className="font-semibold text-green-600">Operational</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="font-semibold">
                    {metrics.activeUsers}/{metrics.totalUsers}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Server className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="font-semibold">{metrics.systemUptime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disk Usage</p>
                  <p className="font-semibold">{metrics.diskUsage}%</p>
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
          <TabsList className="grid w-full grid-cols-6">
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
            <TabsTrigger value="system" className="flex items-center">
              <Server className="w-4 h-4 mr-2" />
              System
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Admin Users
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Activity Logs
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

                <div className="grid gap-4 md:grid-cols-3">
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

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.general.currency}
                      onValueChange={(value) =>
                        updateSettings("general", "currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
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

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure system behavior and maintenance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-500" />
                        Maintenance Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to restrict access
                      </p>
                    </div>
                    <Switch
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(checked) =>
                        updateSettings("system", "maintenanceMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Debug Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable detailed logging for troubleshooting
                      </p>
                    </div>
                    <Switch
                      checked={settings.system.debugMode}
                      onCheckedChange={(checked) =>
                        updateSettings("system", "debugMode", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable automated system backups
                      </p>
                    </div>
                    <Switch
                      checked={settings.system.backupEnabled}
                      onCheckedChange={(checked) =>
                        updateSettings("system", "backupEnabled", checked)
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                      value={settings.system.logLevel}
                      onValueChange={(value) =>
                        updateSettings("system", "logLevel", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warn">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select
                      value={settings.system.backupFrequency}
                      onValueChange={(value) =>
                        updateSettings("system", "backupFrequency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      min="1"
                      max="100"
                      value={settings.system.maxFileSize}
                      onChange={(e) =>
                        updateSettings(
                          "system",
                          "maxFileSize",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Allowed File Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {settings.system.allowedFileTypes.map((type, index) => (
                      <Badge key={index} variant="secondary">
                        .{type}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    File types allowed for uploads across the platform
                  </p>
                </div>

                <Separator />

                {/* System Metrics */}
                <div className="space-y-4">
                  <h4 className="font-medium">System Resources</h4>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">CPU Usage</Label>
                        <span className="text-sm font-medium">
                          {metrics.cpuUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metrics.cpuUsage > 80
                              ? "bg-red-500"
                              : metrics.cpuUsage > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${metrics.cpuUsage}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Memory Usage</Label>
                        <span className="text-sm font-medium">
                          {metrics.memoryUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metrics.memoryUsage > 80
                              ? "bg-red-500"
                              : metrics.memoryUsage > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${metrics.memoryUsage}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Disk Usage</Label>
                        <span className="text-sm font-medium">
                          {metrics.diskUsage}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metrics.diskUsage > 80
                              ? "bg-red-500"
                              : metrics.diskUsage > 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${metrics.diskUsage}%` }}
                        />
                      </div>
                    </div>
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
                    <CardTitle>Administrator Users</CardTitle>
                    <CardDescription>
                      Manage system administrators and their permissions
                    </CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Administrator
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Administrator</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Permissions</TableHead>
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
                            <div className="flex flex-wrap gap-1">
                              {user.permissions
                                .slice(0, 2)
                                .map((permission, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {permission === "all"
                                      ? "All Permissions"
                                      : permission.replace("_", " ")}
                                  </Badge>
                                ))}
                              {user.permissions.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{user.permissions.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </p>
                              <p className="text-muted-foreground">
                                {new Date(user.lastLogin).toLocaleTimeString()}
                              </p>
                            </div>
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
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Key className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleUserStatus(user.id)}
                              >
                                {user.isActive ? (
                                  <Lock className="w-4 h-4" />
                                ) : (
                                  <Unlock className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Logs */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Activity Logs</CardTitle>
                    <CardDescription>
                      Monitor system activities and administrator actions
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export Logs
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Logs
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Clear Activity Logs
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all activity logs. This
                            action cannot be undone. Are you sure you want to
                            continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                            Clear Logs
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No activity logs found
                      </h3>
                      <p className="text-muted-foreground">
                        System activities will appear here when they occur.
                      </p>
                    </div>
                  ) : (
                    activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Activity className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium">{log.action}</p>
                                <Badge variant="outline" className="text-xs">
                                  {log.userName}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {log.details}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <p>
                              {new Date(log.timestamp).toLocaleDateString()}
                            </p>
                            <p>
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Wifi className="w-3 h-3 mr-1" />
                              {log.ipAddress}
                            </span>
                            <span className="flex items-center">
                              <Globe className="w-3 h-3 mr-1" />
                              {log.userAgent.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {activityLogs.length > 0 && (
                  <div className="flex items-center justify-center pt-4">
                    <Button variant="outline" size="sm">
                      Load More Logs
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks and system operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Download className="w-6 h-6" />
                <span>System Backup</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Upload className="w-6 h-6" />
                <span>Import Data</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <RefreshCw className="w-6 h-6" />
                <span>Clear Cache</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="w-6 h-6" />
                <span>Generate Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Platform Version
                </Label>
                <p className="font-medium">v2.1.0</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Database Version
                </Label>
                <p className="font-medium">PostgreSQL 14.2</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Node.js Version
                </Label>
                <p className="font-medium">v18.17.0</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Last Updated
                </Label>
                <p className="font-medium">January 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
