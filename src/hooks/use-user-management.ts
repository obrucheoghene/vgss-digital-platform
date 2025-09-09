import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Types for user management
export interface User {
  id: string;
  name: string;
  email: string;
  type: "VGSS_OFFICE" | "BLW_ZONE" | "SERVICE_DEPARTMENT" | "GRADUATE";
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  createdBy?: string;
}

export interface UserStats {
  total: number;
  active: number;
  pending: number;
  deactivated: number;
  byType: {
    VGSS_OFFICE: number;
    BLW_ZONE: number;
    SERVICE_DEPARTMENT: number;
    GRADUATE: number;
  };
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  stats: UserStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserFilters {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Hook to fetch users with filters and pagination
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async (): Promise<UsersResponse> => {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.type && filters.type !== "all")
        params.append("type", filters.type);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
}

// Hook to fetch a single user by ID
export function useUser(userId?: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async (): Promise<{ success: boolean; user: User }> => {
      if (!userId) throw new Error("User ID is required");

      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user");
      }

      return response.json();
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for user actions (activate, deactivate, reset password, etc.)
export function useUserActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      action,
      data,
    }: {
      userId: string;
      action: string;
      data?: any;
    }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, ...data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Action failed");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the user in the cache
      queryClient.setQueryData(["user", variables.userId], {
        success: true,
        user: data.user,
      });

      // Invalidate users list to refresh
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Success toast
      const actionMessages = {
        toggle_activation: data.user.isDeactivated
          ? "User account deactivated successfully"
          : "User account activated successfully",
        reset_password: "Password reset successfully",
        update_details: "User details updated successfully",
      };

      toast.success(
        actionMessages[variables.action as keyof typeof actionMessages] ||
          "Action completed successfully"
      );
    },
    onError: (error: Error) => {
      toast.error(`Action failed: ${error.message}`);
    },
  });
}

// Hook for bulk user actions
export function useBulkUserActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      userIds,
    }: {
      action: string;
      userIds: string[];
    }) => {
      const response = await fetch("/api/admin/users/bulk-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, userIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bulk action failed");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success(`${data.message} - ${data.updatedCount} users updated`);
    },
    onError: (error: Error) => {
      toast.error(`Bulk action failed: ${error.message}`);
    },
  });
}

// Hook for creating new users
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      type: string;
      password?: string;
    }) => {
      const response = await fetch("/api/admin/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate users queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      toast.success("User account created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create user: ${error.message}`);
    },
  });
}

// Hook for user statistics
export function useUserStats() {
  return useQuery({
    queryKey: ["user-stats"],
    queryFn: async (): Promise<UserStats> => {
      const response = await fetch("/api/admin/users?limit=1"); // Get minimal data just for stats
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user statistics");
      }

      const data = await response.json();
      return data.stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

// Hook for user activity/audit log (future implementation)
export function useUserActivity(userId?: string) {
  return useQuery({
    queryKey: ["user-activity", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      // This would fetch user activity/audit logs from an API
      // For now, return mock data
      return {
        activities: [
          {
            id: "1",
            action: "login",
            timestamp: new Date().toISOString(),
            metadata: { ip: "192.168.1.1", userAgent: "Mozilla/5.0..." },
          },
        ],
      };
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

// Custom hook that combines multiple user management hooks
export function useUserManagement(filters: UserFilters = {}) {
  const usersQuery = useUsers(filters);
  const statsQuery = useUserStats();
  const userActions = useUserActions();
  const bulkActions = useBulkUserActions();

  return {
    // Data
    users: usersQuery.data?.users || [],
    stats: usersQuery.data?.stats || statsQuery.data,
    pagination: usersQuery.data?.pagination,

    // Loading states
    isLoading: usersQuery.isLoading,
    isRefreshing: usersQuery.isFetching,

    // Error states
    isError: usersQuery.isError,
    error: usersQuery.error,

    // Actions
    refetch: usersQuery.refetch,
    performUserAction: userActions.mutate,
    performBulkAction: bulkActions.mutate,

    // Action states
    isPerformingAction: userActions.isPending,
    isPerformingBulkAction: bulkActions.isPending,
  };
}
