// src/app/dashboard/service-department/page.tsx
"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserPlus,
  Clock,
  CheckCircle,
  FileText,
  ArrowRight,
  AlertCircle,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import {
  useServiceDepartmentDashboard,
  type AssignedStaff,
  type StaffRequest,
} from "@/hooks/use-service-department-dashboard";
import { formatDistanceToNow, format } from "date-fns";

export default function ServiceDepartmentDashboard() {
  const { data, isLoading, error } = useServiceDepartmentDashboard();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Serving":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "Sighting":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Sighting
          </Badge>
        );
      case "Interviewed":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Interviewed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Pending
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Approved
          </Badge>
        );
      case "Fulfilled":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Fulfilled
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "Urgent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Urgent
          </Badge>
        );
      case "High":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            High
          </Badge>
        );
      case "Medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Medium
          </Badge>
        );
      case "Low":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Low
          </Badge>
        );
      default:
        return <Badge variant="outline">{urgency}</Badge>;
    }
  };

  if (error) {
    return (
      <DashboardLayout title="Service Department Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-muted-foreground">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Service Department Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {isLoading ? (
                  <Skeleton className="h-8 w-64 bg-white/20" />
                ) : (
                  `Welcome, ${data?.department?.name || "Service Department"}!`
                )}
              </h2>
              <p className="opacity-90">
                Manage your VGSS staff assignments and track their service
                progress.
              </p>
            </div>
            <div className="hidden md:block">
              <Link href="/dashboard/service-department/staff-requests">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Request New Staff
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total VGSS Staff
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats?.totalStaff || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Assigned to your department
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Staff
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats?.activeStaff || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Currently serving</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Requests
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats?.pendingRequests || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Requests
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                <ClipboardList className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {data?.stats?.totalRequests || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">All time requests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Current Staff */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Current VGSS Staff
              </CardTitle>
              <CardDescription>
                Your assigned graduates and their service progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full mt-4" />
                    </div>
                  ))}
                </>
              ) : data?.staff && data.staff.length > 0 ? (
                <>
                  {data.staff.slice(0, 4).map((staff: AssignedStaff) => (
                    <div
                      key={staff.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">
                            {staff.graduateFirstname} {staff.graduateSurname}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {staff.courseOfStudy || "N/A"} -{" "}
                            {staff.nameOfUniversity || "N/A"}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(staff.status)}
                          {staff.serviceStartedDate && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Since{" "}
                              {format(
                                new Date(staff.serviceStartedDate),
                                "MMM yyyy"
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            Contact
                          </p>
                          <p className="text-sm truncate">{staff.email}</p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground text-xs">
                              Service Progress
                            </span>
                            <span className="font-medium text-xs">
                              {staff.serviceProgress}%
                            </span>
                          </div>
                          <Progress
                            value={staff.serviceProgress}
                            className="h-2"
                          />
                        </div>
                      </div>

                      {staff.chapterName && (
                        <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                          Chapter: {staff.chapterName}
                        </p>
                      )}
                    </div>
                  ))}

                  {data.staff.length > 4 && (
                    <div className="pt-4 border-t">
                      <Link href="/dashboard/service-department/staff">
                        <Button
                          variant="ghost"
                          className="w-full justify-between"
                        >
                          View All Staff ({data.staff.length})
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">No Staff Assigned Yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Request staff members to get started.
                  </p>
                  <Link href="/dashboard/service-department/staff-requests">
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Request Staff
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Staff Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Requests
              </CardTitle>
              <CardDescription>Your latest staff requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </>
              ) : data?.recentRequests && data.recentRequests.length > 0 ? (
                <>
                  {data.recentRequests.map((request: StaffRequest) => (
                    <div
                      key={request.id}
                      className="p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">
                          {request.positionTitle}
                        </h4>
                        {getUrgencyBadge(request.urgency)}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {request.fulfilledCount}/{request.numberOfStaff}{" "}
                          filled
                        </span>
                        {getRequestStatusBadge(request.status)}
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(request.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <Link href="/dashboard/service-department/staff-requests">
                      <Button
                        variant="ghost"
                        className="w-full justify-between"
                      >
                        View All Requests
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">No Requests Yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first staff request.
                  </p>
                  <Link href="/dashboard/service-department/staff-requests">
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      New Request
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Commonly used Service Department functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/dashboard/service-department/staff-requests">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <UserPlus className="w-6 h-6" />
                  <span>Request Staff</span>
                </Button>
              </Link>
              <Link href="/dashboard/service-department/staff">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <Users className="w-6 h-6" />
                  <span>View My Staff</span>
                </Button>
              </Link>
              <Link href="/dashboard/service-department/staff-requests">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <ClipboardList className="w-6 h-6" />
                  <span>View Requests</span>
                </Button>
              </Link>
              <Link href="/dashboard/service-department/settings">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <FileText className="w-6 h-6" />
                  <span>Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
