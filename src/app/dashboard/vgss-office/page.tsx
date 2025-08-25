// src/app/dashboard/vgss-office/page.tsx
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
import {
  Users,
  GraduationCap,
  Building,
  TrendingUp,
  UserPlus,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function VGSSOfficeDashboard() {
  // Mock data - replace with real data from your database

  const stats = [
    {
      title: "Total Graduates",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: GraduationCap,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Zones",
      value: "45",
      change: "+3",
      trend: "up",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Ministry Offices",
      value: "28",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Reviews",
      value: "67",
      change: "-5%",
      trend: "down",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "registration",
      user: "John Doe",
      action: "completed registration",
      time: "2 minutes ago",
      status: "pending",
    },
    {
      id: 2,
      type: "approval",
      user: "Jane Smith",
      action: "was approved by Lagos Zone",
      time: "15 minutes ago",
      status: "approved",
    },
    {
      id: 3,
      type: "interview",
      user: "Mike Johnson",
      action: "completed interview questions",
      time: "1 hour ago",
      status: "completed",
    },
    {
      id: 4,
      type: "upload",
      user: "Abuja Zone",
      action: "uploaded 23 new graduate records",
      time: "2 hours ago",
      status: "completed",
    },
    {
      id: 5,
      type: "placement",
      user: "Sarah Wilson",
      action: "was placed in Ministry of Music",
      time: "3 hours ago",
      status: "completed",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Review Graduate Applications",
      count: 12,
      priority: "high",
      dueDate: "Today",
    },
    {
      id: 2,
      title: "Schedule Interviews",
      count: 8,
      priority: "medium",
      dueDate: "Tomorrow",
    },
    {
      id: 3,
      title: "Ministry Placement Review",
      count: 5,
      priority: "medium",
      dueDate: "This Week",
    },
    {
      id: 4,
      title: "Monthly Reports",
      count: 1,
      priority: "low",
      dueDate: "Next Week",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-200">
            Approved
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <DashboardLayout title="VGSS Office Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, Administrator!
              </h2>
              <p className="opacity-90">
                Manage the VGSS platform and oversee all operations from your
                central dashboard.
              </p>
            </div>

            <div className="hidden md:block">
              <Link href={"/dashboard/vgss-office/create-account"}>
                <Button
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Account
                </Button>
              </Link>
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
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}
                    />
                    <span
                      className={
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest activities across the VGSS platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {activity.user}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {activity.action}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <Button variant="ghost" className="w-full justify-between">
                  View All Activity
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
              <CardDescription>
                Tasks that require your attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge
                      variant="secondary"
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{task.count} items</span>
                    <span>{task.dueDate}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.random() * 100}%` }}
                    />
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
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <UserPlus className="w-6 h-6" />
                <span>Create Account</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="w-6 h-6" />
                <span>Manage Users</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <GraduationCap className="w-6 h-6" />
                <span>Review Graduates</span>
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
