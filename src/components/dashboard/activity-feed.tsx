// src/components/dashboard/activity-feed.tsx
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  UserPlus,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Activity } from "@/hooks/use-dashboard";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  activities?: Activity[];
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function ActivityFeed({
  activities = [],
  loading = false,
  onRefresh,
  refreshing = false,
}: ActivityFeedProps) {
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "registration":
        return UserPlus;
      case "upload":
        return Upload;
      case "status_change":
        return CheckCircle;
      case "interview":
        return FileText;
      default:
        return FileText;
    }
  };

  const getActivityIconColor = (type: Activity["type"]) => {
    switch (type) {
      case "registration":
        return "text-green-600 bg-green-100";
      case "upload":
        return "text-blue-600 bg-blue-100";
      case "status_change":
        return "text-orange-600 bg-orange-100";
      case "interview":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      under_review: { label: "Under Review", variant: "secondary" as const },
      invited_for_interview: {
        label: "Interview",
        variant: "outline" as const,
      },
      interviewed: { label: "Interviewed", variant: "outline" as const },
      serving: { label: "Serving", variant: "default" as const },
      pending_registration: { label: "Pending", variant: "secondary" as const },
      registered: { label: "Registered", variant: "default" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest activities across the VGSS platform
            </CardDescription>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")}
              />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
            <p className="text-muted-foreground">
              Recent platform activities will appear here as they happen.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = getActivityIcon(activity.type);
                const iconColorClass = getActivityIconColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors group"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center",
                        iconColorClass
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {activity.title}
                        </h4>
                        {getStatusBadge(activity.status)}
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {activity.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">
                          {activity.timeAgo}
                        </p>

                        {activity.metadata && (
                          <div className="flex items-center space-x-2">
                            {activity.metadata.zone && (
                              <span className="text-xs text-muted-foreground">
                                via {activity.metadata.zone}
                              </span>
                            )}
                            {activity.metadata.email && (
                              <span className="text-xs text-muted-foreground">
                                • {activity.metadata.email}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {activities.length > 0 && (
          <div className="pt-4 border-t mt-4">
            <Button variant="ghost" className="w-full justify-between">
              View All Activity
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
