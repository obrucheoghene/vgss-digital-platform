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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  User,
  MessageSquare,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Building,
  Phone,
  Mail,
  Loader2,
  XCircle,
  RefreshCw,
  Briefcase,
} from "lucide-react";
import { useGraduateDashboard } from "@/hooks/use-graduate-dashboard";

export default function GraduateDashboard() {
  const { data, isLoading, isError, refetch, isFetching } =
    useGraduateDashboard();

  const graduate = data?.graduate;
  const stats = data?.stats;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; icon: typeof Clock }> = {
      "Under Review": { className: "bg-yellow-100 text-yellow-800", icon: Clock },
      "Invited For Interview": {
        className: "bg-blue-100 text-blue-800",
        icon: Calendar,
      },
      Interviewed: {
        className: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
      },
      Sighting: { className: "bg-orange-100 text-orange-800", icon: Clock },
      Serving: { className: "bg-green-100 text-green-800", icon: CheckCircle },
      "Not Accepted": { className: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || {
      className: "bg-gray-100 text-gray-800",
      icon: Clock,
    };

    const Icon = config.icon;

    return (
      <Badge className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Graduate Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading your dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (isError || !graduate) {
    return (
      <DashboardLayout title="Graduate Dashboard">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">Failed to load dashboard</h3>
          <p className="text-muted-foreground mb-4">
            We could not load your profile data. Please try again.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: "Service Progress",
      value: `${stats?.serviceProgress || 0}%`,
      subtitle: `${stats?.serviceDaysCompleted || 0} days completed`,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      progress: stats?.serviceProgress || 0,
    },
    {
      title: "Profile Status",
      value: `${stats?.profileCompletion || 0}%`,
      subtitle:
        stats?.profileCompletion === 100 ? "Complete" : "Complete your profile",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: stats?.profileCompletion || 0,
    },
    {
      title: "Application Status",
      value: graduate.status,
      subtitle:
        graduate.status === "Serving"
          ? "Currently serving"
          : "Processing",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progress:
        graduate.status === "Serving"
          ? 100
          : graduate.status === "Sighting"
          ? 80
          : graduate.status === "Interviewed"
          ? 60
          : graduate.status === "Invited For Interview"
          ? 40
          : 20,
    },
    {
      title: "NYSC Status",
      value: graduate.nyscStatus?.replace("_", " ") || "N/A",
      subtitle: graduate.nyscStatus === "COMPLETED" ? "Cleared" : "In progress",
      icon: GraduationCap,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      progress: graduate.nyscStatus === "COMPLETED" ? 100 : 50,
    },
  ];

  return (
    <DashboardLayout title="Graduate Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-2 border-white/20">
                {graduate.photo ? (
                  <AvatarImage
                    src={graduate.photo}
                    alt={graduate.graduateFirstname}
                  />
                ) : null}
                <AvatarFallback className="text-xl bg-white/20 text-white">
                  {getInitials(
                    graduate.graduateFirstname,
                    graduate.graduateSurname
                  )}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  Welcome, {graduate.graduateFirstname}!
                </h2>
                <p className="opacity-90 mb-2">
                  {graduate.courseOfStudy} - {graduate.nameOfUniversity}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Service Day: {stats?.serviceDaysCompleted || 0} of{" "}
                      {stats?.totalServiceDays || 365}
                    </span>
                  </div>
                  {graduate.nameOfZone && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{graduate.nameOfZone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              {getStatusBadge(graduate.status)}
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-1 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bgColor}`}
                  >
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {stat.subtitle}
                  </p>
                  <Progress value={stat.progress} className="h-2" />
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {graduate.graduateFirstname} {graduate.graduateSurname}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium">{graduate.graduateGender}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(graduate.dateOfBirth)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Place of Birth</p>
                  <p className="font-medium">{graduate.placeOfBirth || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">State of Origin</p>
                  <p className="font-medium">{graduate.stateOfOrigin || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Marital Status</p>
                  <p className="font-medium">{graduate.maritalStatus || "N/A"}</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{graduate.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{graduate.graduatePhoneNumber || "N/A"}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{graduate.homeAddress || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education & Ministry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2" />
                Education & Ministry
              </CardTitle>
              <CardDescription>Your academic and ministry background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Education</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">University</p>
                    <p className="font-medium">{graduate.nameOfUniversity || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Course</p>
                    <p className="font-medium">{graduate.courseOfStudy || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Graduation Year</p>
                    <p className="font-medium">{graduate.graduationYear || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Grade</p>
                    <p className="font-medium">{graduate.grade || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Ministry Information</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Zone</p>
                    <p className="font-medium">{graduate.nameOfZone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chapter</p>
                    <p className="font-medium">{graduate.chapterName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Zonal Pastor</p>
                    <p className="font-medium">{graduate.nameOfZonalPastor || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chapter Pastor</p>
                    <p className="font-medium">{graduate.nameOfChapterPastor || "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Service Assignment
              </CardTitle>
              <CardDescription>Your VGSS placement information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {graduate.serviceDepartmentName ? (
                <>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">
                        You have been assigned!
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Department: {graduate.serviceDepartmentName}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Service Started</p>
                      <p className="font-medium">
                        {formatDate(graduate.serviceStartedDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      {getStatusBadge(graduate.status)}
                    </div>
                    {graduate.preferredCityOfPosting && (
                      <div className="sm:col-span-2">
                        <p className="text-xs text-muted-foreground">
                          Preferred City
                        </p>
                        <p className="font-medium">
                          {graduate.preferredCityOfPosting}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">
                      Awaiting Assignment
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your application is being processed. You will be notified once
                    you are assigned to a service department.
                  </p>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Current Status</p>
                    {getStatusBadge(graduate.status)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills & Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Skills & Experience
              </CardTitle>
              <CardDescription>Your skills and ministry experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Skills Possessed</p>
                <p className="bg-muted/50 p-3 rounded-lg text-sm">
                  {graduate.skillsPossessed || "No skills listed"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Leadership Roles in Ministry
                </p>
                <p className="bg-muted/50 p-3 rounded-lg text-sm">
                  {graduate.leadershipRolesInMinistryAndFellowship || "No roles listed"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Ministry Programs Attended
                </p>
                <p className="bg-muted/50 p-3 rounded-lg text-sm">
                  {graduate.ministryProgramsAttended || "No programs listed"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used graduate functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <User className="w-6 h-6" />
                <span>Update Profile</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="w-6 h-6" />
                <span>View Application</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BookOpen className="w-6 h-6" />
                <span>Resources</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="w-6 h-6" />
                <span>Contact Support</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
