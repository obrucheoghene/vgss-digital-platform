// src/app/dashboard/vgss-office/page.tsx
"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TasksCard } from "@/components/dashboard/tasks-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  GraduationCap,
  Building,
  AlertCircle,
  UserPlus,
  FileText,
  BarChart3,
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle,
  House,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  useDashboardOverview,
  useRefreshDashboard,
} from "@/hooks/use-dashboard";
import { toast } from "sonner";
import { useEffect } from "react";

export default function VGSSOfficeDashboard() {
  const { stats, activities, tasks, isLoading, isError, error, refetch } =
    useDashboardOverview();
  const refreshMutation = useRefreshDashboard();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (isError && error) {
      toast.error(`Dashboard Error: ${error.message}`);
    }
  }, [isError, error]);

  const statsCards = [
    {
      title: "Total Graduates",
      value: stats?.totalGraduates || 0,
      change: stats?.graduatesTrend,
      trend: stats?.graduatesTrendDirection,
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      description: "Registered VGSS graduates",
    },
    {
      title: "BLW Zones",
      value: stats?.totalBLWZones || 0,
      change: "+3",
      trend: "up" as const,
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
      description: "Active zone accounts",
    },
    {
      title: "Service Departments",
      value: stats?.totalMinistryOffices || 0,
      change: "+2",
      trend: "up" as const,
      icon: House,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      description: "Ministry office accounts",
    },
    {
      title: "Pending Reviews",
      value: stats?.pendingReviews || 0,
      change: (stats?.pendingReviews || 0) > 20 ? "High Priority" : "Normal",
      trend:
        (stats?.pendingReviews || 0) > 20
          ? ("up" as const)
          : ("neutral" as const),
      icon: AlertCircle,
      color:
        (stats?.pendingReviews || 0) > 20 ? "text-red-600" : "text-orange-600",
      bgColor:
        (stats?.pendingReviews || 0) > 20 ? "bg-red-100" : "bg-orange-100",
      description: "Applications awaiting review",
    },
  ];

  const quickActions = [
    {
      title: "Create Account",
      description: "Add new user accounts",
      icon: UserPlus,
      href: "/dashboard/vgss-office/create-account",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: Users,
      href: "/dashboard/vgss-office/users",
      color: "text-green-600",
      bgColor: "bg-green-50",
      badge: stats?.totalUsers.toString(),
    },
    {
      title: "Review Graduates",
      description: "Review applications",
      icon: GraduationCap,
      href: "/dashboard/vgss-office/graduates",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      badge:
        (stats?.pendingReviews || 0) > 0
          ? stats?.pendingReviews.toString()
          : undefined,
    },
    {
      title: "Generate Reports",
      description: "View analytics & reports",
      icon: BarChart3,
      href: "/dashboard/vgss-office/reports",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <DashboardLayout title="VGSS Office Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border border-white rounded-full"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 border border-white rounded-full"></div>
          </div>

          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, Administrator!
              </h2>
              <p className="opacity-90 text-base">
                Manage the VGSS platform and oversee all operations from your
                central dashboard.
              </p>

              {/* Quick Stats in Welcome */}
              {/* <div className="flex items-center space-x-6 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {stats?.totalGraduates || 0}
                  </div>
                  <div className="text-xs opacity-80">Total Graduates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {stats?.activeUsers || 0}
                  </div>
                  <div className="text-xs opacity-80">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {stats?.pendingReviews || 0}
                  </div>
                  <div className="text-xs opacity-80">Pending Reviews</div>
                </div>
              </div> */}
            </div>

            <div className="hidden md:block">
              <div className="flex flex-col space-y-2">
                <Link href="/dashboard/vgss-office/create-account">
                  <Button
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create New Account
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshMutation.isPending}
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      refreshMutation.isPending ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please try refreshing the page.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              description={stat.description}
              loading={isLoading}
            />
          ))}
        </div>

        {/* Status Distribution */}
        {stats?.statusDistribution && !isLoading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Graduate Status Overview
              </CardTitle>
              <CardDescription>
                Current distribution of graduate statuses across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                {Object.entries(stats.statusDistribution).map(
                  ([status, count]) => (
                    <div
                      key={status}
                      className="text-center p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-primary">
                        {count}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {status.replace(/_/g, " ")}
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity - Takes 2 columns */}
          <ActivityFeed
            activities={activities}
            loading={isLoading}
            onRefresh={refetch}
            refreshing={refreshMutation.isPending}
          />

          {/* Upcoming Tasks */}
          <TasksCard tasks={tasks} loading={isLoading} />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Commonly used administrative functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} href={action.href}>
                    <Button
                      variant="outline"
                      className="h-20 flex-col space-y-2 w-full relative group hover:shadow-md transition-all"
                    >
                      <div
                        className={`w-12 h-12 rounded-lg ${action.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                      >
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">
                          {action.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                      {action.badge && (
                        <Badge
                          variant="secondary"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs"
                        >
                          {action.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Platform Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Platform Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">
                  {stats?.usersByType.BLW_ZONE || 0}
                </div>
                <div className="text-sm text-blue-700">BLW Zones Connected</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <House className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  {stats?.usersByType.MINISTRY_OFFICE || 0}
                </div>
                <div className="text-sm text-green-700">
                  Service Departments
                </div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <GraduationCap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">
                  {stats?.usersByType.GRADUATE || 0}
                </div>
                <div className="text-sm text-purple-700">
                  Registered Graduates
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
