// src/app/dashboard/blw-zone/page.tsx
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
  Upload,
  Users,
  CheckCircle,
  Clock,
  FileText,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Church,
  GraduationCap,
  Eye,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
  useBLWZoneDashboard,
  type RecentUpload,
  type RecentRegistration,
} from "@/hooks/use-blw-zone-dashboard";
import { formatDistanceToNow } from "date-fns";

export default function BLWZoneDashboard() {
  const { data, isLoading, error } = useBLWZoneDashboard();

  const stats = data?.stats;
  const recentUploads = data?.recentUploads || [];
  const recentRegistrations = data?.recentRegistrations || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Under Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Under Review
          </Badge>
        );
      case "Invited For Interview":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Interview
          </Badge>
        );
      case "Interviewed":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Interviewed
          </Badge>
        );
      case "Sighting":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Sighting
          </Badge>
        );
      case "Serving":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Serving
          </Badge>
        );
      case "Not Accepted":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Not Accepted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (error) {
    return (
      <DashboardLayout title="BLW Zone Dashboard">
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

  // Calculate registration rate
  const registrationRate =
    stats && stats.totalUploadedGraduates > 0
      ? Math.round(
          (stats.totalRegisteredGraduates / stats.totalUploadedGraduates) * 100
        )
      : 0;

  return (
    <DashboardLayout title="BLW Zone Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, Zonal Admin!</h2>
              <p className="opacity-90">
                Manage and track your zone&apos;s graduates in the VGSS program.
              </p>
            </div>
            <div className="hidden md:block">
              <Link href="/dashboard/blw-zone/upload">
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Graduates
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Graduates Uploaded
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                <Upload className="w-4 h-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.totalUploadedGraduates || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Total uploaded</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Registered
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                <UserCheck className="w-4 h-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.totalRegisteredGraduates || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Completed registration
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
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
                  {stats?.totalPendingRegisteredGraduates || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Awaiting registration
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Service
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-purple-100">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.totalInServiceGraduates || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Currently serving</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chapters
              </CardTitle>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100">
                <Church className="w-4 h-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats?.totalChapters || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Total chapters</p>
            </CardContent>
          </Card>
        </div>

        {/* Registration Progress & Status Breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Registration Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Registration Progress
              </CardTitle>
              <CardDescription>
                Track how many uploaded graduates have registered
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Registration Rate
                      </span>
                      <span className="font-semibold">{registrationRate}%</span>
                    </div>
                    <Progress value={registrationRate} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {stats?.totalRegisteredGraduates || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Registered</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        {stats?.totalPendingRegisteredGraduates || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Graduate Status Breakdown
              </CardTitle>
              <CardDescription>
                Distribution of registered graduates by status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.statusBreakdown &&
                    Object.entries(stats.statusBreakdown).map(
                      ([status, count]) => {
                        const total = stats.totalRegisteredGraduates || 1;
                        const percentage = Math.round((count / total) * 100) || 0;
                        return (
                          <div key={status} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{status}</span>
                              <span className="font-medium">
                                {count} ({percentage}%)
                              </span>
                            </div>
                            <Progress
                              value={percentage}
                              className="h-2"
                            />
                          </div>
                        );
                      }
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Recent Uploads
              </CardTitle>
              <CardDescription>
                Graduates you recently uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentUploads.length > 0 ? (
                <div className="space-y-3">
                  {recentUploads.map((upload: RecentUpload) => (
                    <div
                      key={upload.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {upload.graduateFirstname} {upload.graduateSurname}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {upload.chapterName || "No Chapter"} &bull;{" "}
                            {upload.courseOfStudy}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {upload.isRegistered ? (
                          <Badge className="bg-green-100 text-green-800">
                            Registered
                          </Badge>
                        ) : (
                          <Badge variant="outline">Pending</Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(upload.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 border-t">
                    <Link href="/dashboard/blw-zone/graduates">
                      <Button variant="ghost" className="w-full justify-between">
                        View All Graduates
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">No Uploads Yet</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start by uploading graduate data
                  </p>
                  <Link href="/dashboard/blw-zone/upload">
                    <Button size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Graduates
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Registrations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Recent Registrations
              </CardTitle>
              <CardDescription>
                Graduates who recently completed registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentRegistrations.length > 0 ? (
                <div className="space-y-3">
                  {recentRegistrations.map((reg: RecentRegistration) => (
                    <div
                      key={reg.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {reg.graduateFirstname} {reg.graduateSurname}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {reg.chapterName || "No Chapter"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(reg.status)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(reg.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 border-t">
                    <Link href="/dashboard/blw-zone/graduates">
                      <Button variant="ghost" className="w-full justify-between">
                        View All Registrations
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="font-medium mb-2">No Registrations Yet</h4>
                  <p className="text-sm text-muted-foreground">
                    Graduates will appear here once they register
                  </p>
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
              Common tasks for managing your zone&apos;s graduates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/dashboard/blw-zone/upload">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <Upload className="w-6 h-6" />
                  <span>Upload Graduates</span>
                </Button>
              </Link>
              <Link href="/dashboard/blw-zone/graduates">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <Users className="w-6 h-6" />
                  <span>View Graduates</span>
                </Button>
              </Link>
              <Link href="/dashboard/blw-zone/chapters">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <Church className="w-6 h-6" />
                  <span>Manage Chapters</span>
                </Button>
              </Link>
              <Link href="/dashboard/blw-zone/graduates">
                <Button
                  variant="outline"
                  className="h-20 w-full flex-col space-y-2"
                >
                  <Eye className="w-6 h-6" />
                  <span>Track Status</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
