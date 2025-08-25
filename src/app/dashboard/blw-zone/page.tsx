// src/app/dashboard/blw-zone/page.tsx
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
  Upload,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export default function BLWZoneDashboard() {
  const stats = [
    {
      title: "Graduates Uploaded",
      value: "89",
      change: "+7",
      trend: "up",
      icon: Upload,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Registered",
      value: "67",
      change: "+12",
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Pending Registration",
      value: "22",
      change: "-5",
      trend: "down",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "In Service",
      value: "45",
      change: "+8",
      trend: "up",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  const recentGraduates = [
    {
      id: 1,
      name: "John Doe",
      fellowship: "Victory Fellowship",
      status: "registered",
      date: "2 days ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      fellowship: "Faith Chapel",
      status: "pending",
      date: "3 days ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      fellowship: "Grace Assembly",
      status: "in-service",
      date: "1 week ago",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      fellowship: "Hope Center",
      status: "registered",
      date: "1 week ago",
    },
  ];

  return (
    <DashboardLayout title="BLW Zone Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome, Zone Leader!</h2>
              <p className="opacity-90">
                Manage and track your {`zone's`} graduates in the VGSS program.
              </p>
            </div>
            <div className="hidden md:block">
              <Button
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Graduates
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
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
                    <span className="ml-1">this month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Graduates */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Graduate Activity</CardTitle>
            <CardDescription>
              Latest updates from your uploaded graduates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGraduates.map((graduate) => (
                <div
                  key={graduate.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{graduate.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {graduate.fellowship}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        graduate.status === "in-service"
                          ? "default"
                          : graduate.status === "registered"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        graduate.status === "in-service"
                          ? "bg-green-100 text-green-800"
                          : graduate.status === "registered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {graduate.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {graduate.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
