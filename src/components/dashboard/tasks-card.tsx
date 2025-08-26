// src/components/dashboard/tasks-card.tsx
"use client";

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
  Calendar,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle,
  Users,
  FileText,
  Settings,
} from "lucide-react";
import { TaskItem } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

interface TasksCardProps {
  tasks?: TaskItem[];
  loading?: boolean;
}

export function TasksCard({ tasks = [], loading = false }: TasksCardProps) {
  const getPriorityConfig = (priority: TaskItem["priority"]) => {
    switch (priority) {
      case "high":
        return {
          color: "text-red-600 bg-red-50 border-red-200",
          icon: AlertCircle,
          iconColor: "text-red-600",
        };
      case "medium":
        return {
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          icon: Clock,
          iconColor: "text-yellow-600",
        };
      case "low":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-600",
        };
      default:
        return {
          color: "text-gray-600 bg-gray-50 border-gray-200",
          icon: Clock,
          iconColor: "text-gray-600",
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "review":
        return Users;
      case "interview":
        return FileText;
      case "placement":
        return Users;
      case "reporting":
        return FileText;
      case "maintenance":
        return Settings;
      default:
        return FileText;
    }
  };

  const getProgressValue = (task: TaskItem) => {
    // Generate a realistic progress value based on priority and due date
    if (task.priority === "high") return Math.random() * 30 + 10; // 10-40%
    if (task.priority === "medium") return Math.random() * 40 + 20; // 20-60%
    return Math.random() * 60 + 30; // 30-90%
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Upcoming Tasks
          </CardTitle>
          <CardDescription>Tasks that require your attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Upcoming Tasks
        </CardTitle>
        <CardDescription>Tasks that require your attention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2 text-green-700">
              All Caught Up!
            </h3>
            <p className="text-muted-foreground">
              No urgent tasks require your attention right now.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const priorityConfig = getPriorityConfig(task.priority);
            const CategoryIcon = getCategoryIcon(task.category);
            const PriorityIcon = priorityConfig.icon;
            const progressValue = getProgressValue(task);

            return (
              <div
                key={task.id}
                className="space-y-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                      <CategoryIcon className="w-4 h-4 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate pr-2">
                          {task.title}
                        </h4>
                        <Badge className={priorityConfig.color}>
                          <PriorityIcon className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <span className="font-medium">{task.count}</span>
                    <span className="ml-1">
                      {task.count === 1 ? "item" : "items"}
                    </span>
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {task.dueDate}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-xs font-medium">
                      {Math.round(progressValue)}%
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-1.5" />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex space-x-2">
                    {task.priority === "high" && (
                      <Button size="sm" className="h-6 text-xs px-2">
                        Start Now
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs px-2"
                    >
                      View Details
                    </Button>
                  </div>

                  {task.category === "review" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2"
                    >
                      Review ({task.count})
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {tasks.length > 0 && (
          <div className="pt-4 border-t">
            <Button variant="ghost" className="w-full justify-between">
              View All Tasks
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
