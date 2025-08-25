// src/app/dashboard/graduate/page.tsx
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
import {
  GraduationCap,
  User,
  MessageSquare,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  FileText,
  ArrowRight,
  AlertCircle,
  MapPin,
  Building,
  Phone,
  Mail,
  Award,
  Target,
  TrendingUp,
} from "lucide-react";

export default function GraduateDashboard() {
  // Mock data - replace with real data from your database
  const profileCompletion = 85;
  const serviceProgress = 42; // Percentage of service year completed

  const stats = [
    {
      title: "Service Progress",
      value: "42%",
      subtitle: "5 months completed",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100",
      progress: 42,
    },
    {
      title: "Profile Status",
      value: "85%",
      subtitle: "Complete your profile",
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      progress: 85,
    },
    {
      title: "Training Modules",
      value: "3/5",
      subtitle: "2 remaining",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      progress: 60,
    },
    {
      title: "Interview Status",
      value: "Completed",
      subtitle: "Awaiting review",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      progress: 100,
    },
  ];

  const currentAssignment = {
    ministry: "Ministry of Music",
    supervisor: "Pastor Sarah Johnson",
    startDate: "Jan 15, 2024",
    location: "Lagos Headquarters",
    department: "Worship & Creative Arts",
    responsibilities: [
      "Audio/Visual equipment management",
      "Music rehearsal coordination",
      "Event setup and breakdown",
      "Digital content creation",
    ],
    rating: 4.7,
  };

  const upcomingTasks = [
    {
      id: 1,
      title: "Complete Training Module 4",
      description: "Leadership & Ministry Excellence",
      dueDate: "Tomorrow",
      priority: "high",
      type: "training",
    },
    {
      id: 2,
      title: "Monthly Service Report",
      description: "Submit your progress report",
      dueDate: "End of Week",
      priority: "high",
      type: "report",
    },
    {
      id: 3,
      title: "Team Meeting Attendance",
      description: "Ministry planning session",
      dueDate: "Friday 2PM",
      priority: "medium",
      type: "meeting",
    },
    {
      id: 4,
      title: "Profile Update Required",
      description: "Update contact information",
      dueDate: "Next Week",
      priority: "low",
      type: "profile",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "training",
      title: "Completed Leadership Foundations",
      description: "Module 3 - Leadership & Ministry Excellence",
      time: "2 days ago",
      status: "completed",
      score: "95%",
    },
    {
      id: 2,
      type: "evaluation",
      title: "Monthly Performance Review",
      description: "Received feedback from Pastor Sarah",
      time: "1 week ago",
      status: "reviewed",
      rating: "4.7/5",
    },
    {
      id: 3,
      type: "assignment",
      title: "Audio System Setup",
      description: "Successfully managed Sunday service audio",
      time: "2 weeks ago",
      status: "completed",
      feedback: "Excellent work!",
    },
    {
      id: 4,
      type: "interview",
      title: "Interview Questions Submitted",
      description: "All required questions answered",
      time: "1 month ago",
      status: "under_review",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50";
      case "medium":
        return "border-l-yellow-500 bg-yellow-50";
      case "low":
        return "border-l-green-500 bg-green-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "training":
        return BookOpen;
      case "report":
        return FileText;
      case "meeting":
        return Calendar;
      case "profile":
        return User;
      case "evaluation":
        return Star;
      case "assignment":
        return Target;
      case "interview":
        return MessageSquare;
      default:
        return AlertCircle;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completed
          </Badge>
        );
      case "reviewed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Reviewed
          </Badge>
        );
      case "under_review":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Under Review
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout title="Graduate Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, Graduate!
              </h2>
              <p className="opacity-90 mb-4">
                Continue your journey in the Volunteer Graduate Service Scheme.
                {`You're`} making a difference!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Service Day: {Math.floor(serviceProgress * 3.65)} of 365
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{currentAssignment.location}</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <FileText className="w-4 h-4 mr-2" />
                Submit Report
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
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

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Current Assignment */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Current Assignment
              </CardTitle>
              <CardDescription>
                Your service placement and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {currentAssignment.ministry}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {currentAssignment.department}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>Supervisor: {currentAssignment.supervisor}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Started: {currentAssignment.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{currentAssignment.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      Performance Rating:
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold">
                        {currentAssignment.rating}/5.0
                      </span>
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(currentAssignment.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Key Responsibilities</h4>
                  <div className="space-y-2">
                    {currentAssignment.responsibilities.map((resp, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full justify-between">
                  View Full Assignment Details
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Items requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => {
                const TypeIcon = getTypeIcon(task.type);
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border-l-4 ${getPriorityColor(
                      task.priority
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                        <h4 className="font-medium text-sm">{task.title}</h4>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {task.priority}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {task.dueDate}</span>
                      <span className="capitalize">{task.type}</span>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t">
                <Button variant="ghost" className="w-full justify-between">
                  View All Tasks
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Your latest progress and achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const TypeIcon = getTypeIcon(activity.type);
                return (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === "training"
                            ? "bg-purple-100"
                            : activity.type === "evaluation"
                            ? "bg-blue-100"
                            : activity.type === "assignment"
                            ? "bg-green-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <TypeIcon
                          className={`w-4 h-4 ${
                            activity.type === "training"
                              ? "text-purple-600"
                              : activity.type === "evaluation"
                              ? "text-blue-600"
                              : activity.type === "assignment"
                              ? "text-green-600"
                              : "text-orange-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {activity.title}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                          <span>{activity.time}</span>
                          {activity.score && (
                            <span>• Score: {activity.score}</span>
                          )}
                          {activity.rating && (
                            <span>• Rating: {activity.rating}</span>
                          )}
                          {activity.feedback && (
                            <span>• {activity.feedback}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Commonly used graduate functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="w-6 h-6" />
                <span>Submit Report</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BookOpen className="w-6 h-6" />
                <span>Training Modules</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <User className="w-6 h-6" />
                <span>Update Profile</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="w-6 h-6" />
                <span>Contact Supervisor</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
