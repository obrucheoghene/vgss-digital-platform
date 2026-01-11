// src/app/dashboard/graduate/assignment/page.tsx
"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  AlertCircle,
  Target,
  Award,
  TrendingUp,
  FileText,
  Users,
} from "lucide-react";
import { useGraduateDashboard } from "@/hooks/use-graduate-dashboard";
import { format, differenceInDays, addDays } from "date-fns";

export default function GraduateAssignmentPage() {
  const { data, isLoading, error } = useGraduateDashboard();

  const graduate = data?.graduate;
  const stats = data?.stats;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Under Review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        );
      case "Invited For Interview":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Calendar className="w-3 h-3 mr-1" />
            Invited For Interview
          </Badge>
        );
      case "Interviewed":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Interviewed
          </Badge>
        );
      case "Sighting":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            <Target className="w-3 h-3 mr-1" />
            Sighting
          </Badge>
        );
      case "Serving":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            Serving
          </Badge>
        );
      case "Not Accepted":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Not Accepted
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate expected end date
  const getExpectedEndDate = () => {
    if (!graduate?.serviceStartedDate) return null;
    const startDate = new Date(graduate.serviceStartedDate);
    return addDays(startDate, 365);
  };

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!graduate?.serviceStartedDate) return null;
    const endDate = getExpectedEndDate();
    if (!endDate) return null;
    const remaining = differenceInDays(endDate, new Date());
    return Math.max(0, remaining);
  };

  if (error) {
    return (
      <DashboardLayout title="Service Assignment">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground">
              Please try refreshing the page.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isServing = graduate?.status === "Serving";
  const isAssigned = !!graduate?.serviceDepartmentId;

  return (
    <DashboardLayout title="Service Assignment">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Service Assignment</h1>
          <p className="text-muted-foreground">
            View your VGSS service assignment details and progress
          </p>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>{getStatusBadge(graduate?.status || "Under Review")}</div>
                <Separator orientation="vertical" className="hidden md:block h-6" />
                <p className="text-muted-foreground">
                  {graduate?.status === "Under Review" &&
                    "Your application is being reviewed by the VGSS Office."}
                  {graduate?.status === "Invited For Interview" &&
                    "You have been invited for an interview. Please check your email for details."}
                  {graduate?.status === "Interviewed" &&
                    "Your interview has been completed. Awaiting final decision."}
                  {graduate?.status === "Sighting" &&
                    "You are in the sighting phase before service begins."}
                  {graduate?.status === "Serving" &&
                    "You are currently serving at your assigned department."}
                  {graduate?.status === "Not Accepted" &&
                    "Unfortunately, your application was not accepted."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment Details - Only show if assigned */}
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : isAssigned ? (
          <>
            {/* Service Department Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Assigned Service Department
                </CardTitle>
                <CardDescription>
                  Your current service department assignment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {graduate?.serviceDepartmentName || "Service Department"}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      You have been assigned to serve at this department for your
                      VGSS service year.
                    </p>
                  </div>
                </div>

                {graduate?.serviceStartedDate && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Service Start Date</span>
                      </div>
                      <p className="font-semibold">
                        {format(
                          new Date(graduate.serviceStartedDate),
                          "MMMM d, yyyy"
                        )}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">Expected End Date</span>
                      </div>
                      <p className="font-semibold">
                        {getExpectedEndDate()
                          ? format(getExpectedEndDate()!, "MMMM d, yyyy")
                          : "N/A"}
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Days Remaining</span>
                      </div>
                      <p className="font-semibold">
                        {getDaysRemaining() !== null
                          ? `${getDaysRemaining()} days`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Service Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Service Progress
                </CardTitle>
                <CardDescription>
                  Track your service year completion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Overall Progress
                    </span>
                    <span className="font-semibold">
                      {stats?.serviceProgress || 0}%
                    </span>
                  </div>
                  <Progress
                    value={stats?.serviceProgress || 0}
                    className="h-3"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-primary">
                      {stats?.serviceDaysCompleted || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Days Completed
                    </p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-orange-600">
                      {getDaysRemaining() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Days Remaining
                    </p>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-3xl font-bold text-green-600">
                      {stats?.totalServiceDays || 365}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Service Days
                    </p>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-4">
                  <h4 className="font-medium">Service Milestones</h4>
                  <div className="space-y-3">
                    {[
                      { days: 0, label: "Service Started", icon: Calendar },
                      { days: 90, label: "First Quarter", icon: Target },
                      { days: 180, label: "Halfway Point", icon: TrendingUp },
                      { days: 270, label: "Third Quarter", icon: Award },
                      { days: 365, label: "Service Completed", icon: CheckCircle },
                    ].map((milestone) => {
                      const completed =
                        (stats?.serviceDaysCompleted || 0) >= milestone.days;
                      const Icon = milestone.icon;
                      return (
                        <div
                          key={milestone.days}
                          className={`flex items-center gap-3 p-3 rounded-lg border ${
                            completed
                              ? "bg-green-50 border-green-200"
                              : "bg-muted/30"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              completed
                                ? "bg-green-100 text-green-600"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                completed ? "text-green-700" : ""
                              }`}
                            >
                              {milestone.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Day {milestone.days}
                            </p>
                          </div>
                          {completed && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Not Yet Assigned */
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Not Yet Assigned
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {graduate?.status === "Under Review" &&
                    "Your application is still under review. You will be notified once you are assigned to a service department."}
                  {graduate?.status === "Invited For Interview" &&
                    "Please complete your interview first. Assignment will be made after successful interview completion."}
                  {graduate?.status === "Interviewed" &&
                    "Your interview is complete. You will be assigned to a service department soon."}
                  {graduate?.status === "Sighting" &&
                    "You are in the sighting phase. Your service department assignment will be finalized shortly."}
                  {graduate?.status === "Not Accepted" &&
                    "Your application was not accepted for the VGSS program."}
                  {!graduate?.status &&
                    "You will be assigned to a service department once your application is approved."}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Service Guidelines
            </CardTitle>
            <CardDescription>
              Important information about your VGSS service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-medium">Your Responsibilities</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Report to your assigned department on time
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Complete all assigned tasks diligently
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Maintain professional conduct at all times
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Participate in all required training sessions
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Support & Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    Contact your department supervisor for guidance
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    Email VGSS Office for administrative issues
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    Call the support helpline for emergencies
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    Review the VGSS handbook for detailed guidelines
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
