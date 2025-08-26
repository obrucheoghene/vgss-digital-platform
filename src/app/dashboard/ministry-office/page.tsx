// src/app/dashboard/ministry-office/page.tsx
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
  Users,
  UserPlus,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  FileText,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

export default function MinistryOfficeDashboard() {
  // Mock data - replace with real data from your database
  const stats = [
    {
      title: "VGSS Staff Assigned",
      value: "8",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Requests",
      value: "3",
      change: "0",
      trend: "neutral",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Monthly Salary Budget",
      value: "₦240,000",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Performance Rating",
      value: "4.8/5.0",
      change: "+0.2",
      trend: "up",
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const currentStaff = [
    {
      id: 1,
      name: "John Doe",
      position: "Administrative Assistant",
      startDate: "Jan 2024",
      performance: 4.9,
      status: "active",
      completionRate: 95,
      department: "Administration",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Ministry Coordinator",
      startDate: "Feb 2024",
      performance: 4.7,
      status: "active",
      completionRate: 88,
      department: "Ministry Operations",
    },
    {
      id: 3,
      name: "Mike Johnson",
      position: "Media Assistant",
      startDate: "Mar 2024",
      performance: 4.8,
      status: "active",
      completionRate: 92,
      department: "Media & Communications",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      position: "Event Coordinator",
      startDate: "Apr 2024",
      performance: 4.6,
      status: "completing",
      completionRate: 78,
      department: "Events",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "salary",
      staff: "John Doe",
      action: "Salary processed via Espees",
      amount: "₦60,000",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 2,
      type: "feedback",
      staff: "Jane Smith",
      action: "Monthly evaluation submitted",
      rating: "4.7/5",
      time: "1 day ago",
      status: "completed",
    },
    {
      id: 3,
      type: "request",
      staff: "New Request",
      action: "Requested 2 additional staff members",
      department: "Youth Ministry",
      time: "3 days ago",
      status: "pending",
    },
    {
      id: 4,
      type: "completion",
      staff: "David Brown",
      action: "Successfully completed VGSS service",
      time: "1 week ago",
      status: "completed",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Submit Monthly Evaluations",
      dueDate: "Tomorrow",
      priority: "high",
      staffCount: 4,
      completed: 2,
    },
    {
      id: 2,
      title: "Process Salary Payments",
      dueDate: "End of Week",
      priority: "high",
      staffCount: 8,
      completed: 6,
    },
    {
      id: 3,
      title: "Review Staff Assignments",
      dueDate: "Next Week",
      priority: "medium",
      staffCount: 3,
      completed: 0,
    },
    {
      id: 4,
      title: "Plan Training Sessions",
      dueDate: "Next Month",
      priority: "low",
      staffCount: 8,
      completed: 1,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Active
          </Badge>
        );
      case "completing":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Completing
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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

  return (
    <DashboardLayout title="Service Department Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome, Service Department!
              </h2>
              <p className="opacity-90">
                Manage your VGSS staff assignments and track their service
                progress.
              </p>
            </div>
            <div className="hidden md:block">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Request New Staff
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
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp
                      className={`w-3 h-3 mr-1 ${
                        stat.trend === "up"
                          ? "text-green-500"
                          : stat.trend === "neutral"
                          ? "text-gray-500"
                          : "text-red-500"
                      }`}
                    />
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-green-600"
                          : stat.trend === "neutral"
                          ? "text-gray-600"
                          : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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
                Your assigned graduates and their performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{staff.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {staff.position}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(staff.status)}
                      <p className="text-sm text-muted-foreground mt-1">
                        Since {staff.startDate}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">
                          Performance
                        </span>
                        <span className="font-medium">
                          {staff.performance}/5.0
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(staff.performance)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground">
                          Service Progress
                        </span>
                        <span className="font-medium">
                          {staff.completionRate}%
                        </span>
                      </div>
                      <Progress value={staff.completionRate} className="h-2" />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
                    Department: {staff.department}
                  </p>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button variant="ghost" className="w-full justify-between">
                  View All Staff
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border-l-4 ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {task.dueDate}</span>
                      <span>
                        {task.completed}/{task.staffCount} completed
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Progress
                        value={(task.completed / task.staffCount) * 100}
                        className="h-1.5"
                      />
                    </div>
                  </div>
                </div>
              ))}

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
              Latest staff management activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === "salary"
                          ? "bg-blue-100"
                          : activity.type === "feedback"
                          ? "bg-purple-100"
                          : activity.type === "request"
                          ? "bg-orange-100"
                          : "bg-green-100"
                      }`}
                    >
                      {activity.type === "salary" && (
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      )}
                      {activity.type === "feedback" && (
                        <MessageSquare className="w-4 h-4 text-purple-600" />
                      )}
                      {activity.type === "request" && (
                        <UserPlus className="w-4 h-4 text-orange-600" />
                      )}
                      {activity.type === "completion" && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {activity.staff}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {activity.action}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                        <span>{activity.time}</span>
                        {activity.amount && <span>• {activity.amount}</span>}
                        {activity.rating && <span>• {activity.rating}</span>}
                        {activity.department && (
                          <span>• {activity.department}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <UserPlus className="w-6 h-6" />
                <span>Request Staff</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <DollarSign className="w-6 h-6" />
                <span>Process Salary</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="w-6 h-6" />
                <span>Submit Feedback</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText className="w-6 h-6" />
                <span>Generate Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
