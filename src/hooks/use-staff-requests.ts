// src/hooks/use-staff-requests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for staff requests
export interface StaffRequest {
  id: string;
  serviceDepartmentId: string;
  positionTitle: string;
  positionDescription: string;
  numberOfStaff: number;
  skillsRequired?: string | null;
  qualificationsRequired?: string | null;
  preferredGender?: "MALE" | "FEMALE" | null;
  urgency: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled" | "Cancelled";
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  fulfilledCount: number;
  fulfilledAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  departmentName?: string;
  departmentEmail?: string;
  approverName?: string;
  approverEmail?: string;
}

export interface StaffRequestAssignment {
  id: string;
  graduateDataId: string;
  assignedBy: string;
  assignedAt: string;
  notes?: string | null;
  graduateFirstname?: string;
  graduateSurname?: string;
  graduateEmail?: string;
  graduateGender?: "MALE" | "FEMALE";
  graduatePhone?: string;
}

export interface StaffRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  fulfilled: number;
  cancelled: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface StaffRequestsResponse {
  success: boolean;
  requests: StaffRequest[];
  stats: StaffRequestStats;
  departments?: Department[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StaffRequestDetailResponse {
  success: boolean;
  request: StaffRequest;
  assignments: StaffRequestAssignment[];
}

export interface StaffRequestFilters {
  status?: string;
  urgency?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AvailableGraduate {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  email: string;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string;
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: number;
  skillsPossessed?: string | null;
  status: string;
  nameOfZone: string;
  createdAt: string;
}

export interface AvailableGraduatesResponse {
  success: boolean;
  graduates: AvailableGraduate[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hook to fetch staff requests
export function useStaffRequests(
  filters: StaffRequestFilters = {},
  isAdmin: boolean = false
) {
  const endpoint = isAdmin
    ? "/api/vgss-office/staff-requests"
    : "/api/service-department/staff-requests";

  return useQuery({
    queryKey: ["staff-requests", filters, isAdmin],
    queryFn: async (): Promise<StaffRequestsResponse> => {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.urgency && filters.urgency !== "all")
        params.append("urgency", filters.urgency);
      if (filters.department && filters.department !== "all")
        params.append("department", filters.department);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`${endpoint}?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch staff requests");
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
}

// Hook to fetch a single staff request's details
export function useStaffRequest(requestId?: string) {
  return useQuery({
    queryKey: ["staff-request", requestId],
    queryFn: async (): Promise<StaffRequestDetailResponse> => {
      if (!requestId) throw new Error("Request ID is required");

      const response = await fetch(
        `/api/vgss-office/staff-requests/${requestId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch staff request");
      }

      return response.json();
    },
    enabled: !!requestId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a staff request (Service Department)
export function useCreateStaffRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      positionTitle: string;
      positionDescription: string;
      numberOfStaff?: number;
      skillsRequired?: string;
      qualificationsRequired?: string;
      preferredGender?: "MALE" | "FEMALE";
      urgency?: "Low" | "Medium" | "High" | "Urgent";
    }) => {
      const response = await fetch("/api/service-department/staff-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create staff request");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-requests"] });
      toast.success("Staff request created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create request: ${error.message}`);
    },
  });
}

// Hook for staff request actions (VGSS Office)
export function useStaffRequestActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      action,
      data,
    }: {
      requestId: string;
      action: "approve" | "reject" | "assign" | "add_notes" | "cancel";
      data?: Record<string, unknown>;
    }) => {
      const response = await fetch(
        `/api/vgss-office/staff-requests/${requestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, ...data }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Action failed");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the request in the cache
      queryClient.setQueryData(
        ["staff-request", variables.requestId],
        (old: StaffRequestDetailResponse | undefined) => {
          if (!old) return old;
          return {
            ...old,
            request: data.request,
          };
        }
      );

      // Invalidate staff requests list to refresh
      queryClient.invalidateQueries({ queryKey: ["staff-requests"] });

      // Also invalidate graduates if we assigned one
      if (variables.action === "assign") {
        queryClient.invalidateQueries({ queryKey: ["available-graduates"] });
      }

      // Success toast
      const actionMessages = {
        approve: "Staff request approved",
        reject: "Staff request rejected",
        assign: "Graduate assigned successfully",
        add_notes: "Notes updated",
        cancel: "Staff request cancelled",
      };

      toast.success(actionMessages[variables.action] || "Action completed");
    },
    onError: (error: Error) => {
      toast.error(`Action failed: ${error.message}`);
    },
  });
}

// Hook to fetch available graduates for assignment
export function useAvailableGraduates(
  filters: { search?: string; gender?: string; page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: ["available-graduates", filters],
    queryFn: async (): Promise<AvailableGraduatesResponse> => {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.gender && filters.gender !== "all")
        params.append("gender", filters.gender);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(
        `/api/vgss-office/staff-requests/available-graduates?${params.toString()}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch available graduates"
        );
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Combined hook for Service Department staff request management
export function useServiceDepartmentRequests(filters: StaffRequestFilters = {}) {
  const requestsQuery = useStaffRequests(filters, false);
  const createRequest = useCreateStaffRequest();

  return {
    // Data
    requests: requestsQuery.data?.requests || [],
    stats: requestsQuery.data?.stats,
    pagination: requestsQuery.data?.pagination,

    // Loading states
    isLoading: requestsQuery.isLoading,
    isRefreshing: requestsQuery.isFetching,

    // Error states
    isError: requestsQuery.isError,
    error: requestsQuery.error,

    // Actions
    refetch: requestsQuery.refetch,
    createRequest: createRequest.mutate,

    // Action states
    isCreating: createRequest.isPending,
  };
}

// Combined hook for VGSS Office staff request management
export function useVGSSOfficeRequests(filters: StaffRequestFilters = {}) {
  const requestsQuery = useStaffRequests(filters, true);
  const requestActions = useStaffRequestActions();

  return {
    // Data
    requests: requestsQuery.data?.requests || [],
    stats: requestsQuery.data?.stats,
    departments: requestsQuery.data?.departments || [],
    pagination: requestsQuery.data?.pagination,

    // Loading states
    isLoading: requestsQuery.isLoading,
    isRefreshing: requestsQuery.isFetching,

    // Error states
    isError: requestsQuery.isError,
    error: requestsQuery.error,

    // Actions
    refetch: requestsQuery.refetch,
    performAction: requestActions.mutate,

    // Action states
    isPerformingAction: requestActions.isPending,
  };
}
