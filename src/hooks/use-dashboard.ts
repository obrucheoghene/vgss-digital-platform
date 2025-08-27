/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-dashboard.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for dashboard data
export interface DashboardStats {
  totalGraduates: number;
  totalBLWZones: number;
  totalServiceDepartments: number;
  pendingReviews: number;
  thisMonthRegisteredGraduates: number;
  // graduatesTrend: string;
  // graduatesTrendDirection: "up" | "down";
  totalUsers: number;
  activeUsers: number;
  usersByType: {
    VGSS_OFFICE: number;
    BLW_ZONE: number;
    SERVICE_DEPARTMENT: number;
    GRADUATE: number;
  };
  statusDistribution: Record<string, number>;
}

export interface Activity {
  id: string;
  type: "registration" | "upload" | "status_change" | "interview";
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  timeAgo: string;
  formattedTime: string;
  status?: string;
  metadata?: any;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string;
  count: number;
  category: string;
}

// Dashboard statistics hook
export function useDashboardStats() {
  return useQuery({
    queryKey: ["vgss-office", "dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const response = await fetch("/api/vgss-office/dashboard-stats");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch dashboard stats");
      }
      const data = await response.json();
      return data.stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    retry: 3,
  });
}

// Recent activity hook
export function useRecentActivity(limit: number = 20) {
  return useQuery({
    queryKey: ["vgss-office", "recent-activity", limit],
    queryFn: async (): Promise<Activity[]> => {
      const response = await fetch(
        `/api/vgss-office/recent-activity?limit=${limit}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch recent activity");
      }
      const data = await response.json();
      return data.activities;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 2,
  });
}

// Upcoming tasks hook (static data for now, can be made dynamic)
export function useUpcomingTasks() {
  return useQuery({
    queryKey: ["vgss-office", "upcoming-tasks"],
    queryFn: async (): Promise<TaskItem[]> => {
      // This could be an API call to get dynamic tasks
      // For now, returning static data based on dashboard stats
      const statsResponse = await fetch("/api/vgss-office/dashboard-stats");
      if (!statsResponse.ok) {
        throw new Error("Failed to fetch stats for tasks");
      }
      const { stats } = await statsResponse.json();

      const tasks: TaskItem[] = [];

      // Generate dynamic tasks based on current stats
      if (stats.pendingReviews > 0) {
        tasks.push({
          id: "review-graduates",
          title: "Review Graduate Applications",
          description: "Review and approve pending graduate applications",
          priority: stats.pendingReviews > 20 ? "high" : "medium",
          dueDate: "Today",
          count: stats.pendingReviews,
          category: "review",
        });
      }

      // Add interview scheduling if there are graduates invited
      if (stats.statusDistribution["Invited For Interview"] > 0) {
        tasks.push({
          id: "schedule-interviews",
          title: "Schedule Interviews",
          description: "Schedule interviews for invited graduates",
          priority: "medium",
          dueDate: "This Week",
          count: stats.statusDistribution["Invited For Interview"],
          category: "interview",
        });
      }

      // Add placement review if there are interviewed graduates
      if (stats.statusDistribution["Interviewed"] > 0) {
        tasks.push({
          id: "placement-review",
          title: "Ministry Placement Review",
          description: "Review and assign ministry placements",
          priority: "high",
          dueDate: "Tomorrow",
          count: stats.statusDistribution["Interviewed"],
          category: "placement",
        });
      }

      // Monthly report task
      const now = new Date();
      const isEndOfMonth = now.getDate() > 25;
      if (isEndOfMonth) {
        tasks.push({
          id: "monthly-reports",
          title: "Monthly Reports",
          description: "Generate monthly statistics and reports",
          priority: "low",
          dueDate: "End of Month",
          count: 1,
          category: "reporting",
        });
      }

      // Add default tasks if no specific tasks
      if (tasks.length === 0) {
        tasks.push(
          {
            id: "system-maintenance",
            title: "System Review",
            description: "Routine system check and maintenance",
            priority: "low",
            dueDate: "This Week",
            count: 1,
            category: "maintenance",
          },
          {
            id: "user-support",
            title: "User Support Review",
            description: "Check for pending user support requests",
            priority: "medium",
            dueDate: "Today",
            count: 2,
            category: "support",
          }
        );
      }

      return tasks;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });
}

// Refresh all dashboard data
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // This simulates a refresh - in reality, we just invalidate queries
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      // Invalidate all dashboard-related queries
      queryClient.invalidateQueries({
        queryKey: ["vgss-office"],
      });
      toast.success("Dashboard data refreshed successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to refresh dashboard: ${error.message}`);
    },
  });
}

// Hook to get dashboard overview data
export function useDashboardOverview() {
  const statsQuery = useDashboardStats();
  const activityQuery = useRecentActivity(10);
  const tasksQuery = useUpcomingTasks();

  return {
    stats: statsQuery.data,
    activities: activityQuery.data,
    tasks: tasksQuery.data,
    isLoading:
      statsQuery.isLoading || activityQuery.isLoading || tasksQuery.isLoading,
    isError: statsQuery.isError || activityQuery.isError || tasksQuery.isError,
    error: statsQuery.error || activityQuery.error || tasksQuery.error,
    refetch: () => {
      statsQuery.refetch();
      activityQuery.refetch();
      tasksQuery.refetch();
    },
  };
}
