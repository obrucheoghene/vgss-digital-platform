import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for graduate management
export interface Graduate {
  id: string;
  userId: string;
  graduateName: string;
  email: string;
  graduateGender: "MALE" | "FEMALE";
  dateOfBirth: string;
  graduatePhoneNumber: string;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  isApproved: boolean;

  // Education
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: number;
  grade: string;

  // Ministry
  nameOfZone: string;
  nameOfFellowship: string;
  nameOfChapterPastor: string;

  // Service
  serviceStartedDate?: string;
  serviceCompletedDate?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;

  // Zone info
  zoneName?: string;
  zoneEmail?: string;
}

export interface DetailedGraduate extends Graduate {
  // Personal Information
  graduateFirstname: string;
  graduateLastname: string;
  maritalStatus: "SINGLE" | "MARRIED";
  placeOfBirth: string;
  stateOfOrigin: string;
  homeAddress: string;

  // Education Details
  nyscStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED";

  // Ministry Details
  nameOfZonalPastor: string;
  phoneNumberOfChapterPastor: string;
  emailOfChapterPastor: string;

  // Spiritual Journey
  whereWhenChrist: string;
  whereWhenHolyGhost: string;
  whereWhenBaptism: string;
  whereWhenFoundationSchool: string;
  hasCertificate: boolean;
  // Family Information
  fatherName: string;
  fatherPhoneNumber: string;
  fatherEmailAddress: string;
  nameOfFatherChurch: string;
  fatherOccupation: string;
  motherName: string;
  motherPhoneNumber: string;
  motherEmailAddress: string;
  motherOccupation: string;
  nameOfMotherChurch: string;
  howManyInFamily: number;
  whatPositionInFamily: number;
  familyResidence: string;
  parentsTogether: boolean;
  parentsAwareOfVgssIntention: boolean;
  // Test Questions
  visionMissionPurpose: string;
  explainWithExamples: string;
  partnershipArms: string;
  fullMeaning: string;
  variousTasksResponsibleFor: string;
  projectProudOfAndRolePlayed: string;
  exampleDifficultSituation: string;
  recentConflict: string;
  convictions: string;
  whyVgss: string;
  plansAfterVgss: string;

  // Management
  comments?: string;
  approvedBy?: string;
}

export interface GraduateStats {
  total: number;
  approved: number;
  pending: number;
  byStatus: {
    "Under Review": number;
    "Invited For Interview": number;
    Interviewed: number;
    Sighting: number;
    Serving: number;
    "Not Accepted": number;
  };
  byGender: {
    MALE: number;
    FEMALE: number;
  };
}

export interface GraduatesResponse {
  success: boolean;
  graduates: Graduate[];
  stats: GraduateStats;
  zones: string[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GraduateFilters {
  search?: string;
  status?: string;
  zone?: string;
  gender?: string;
  page?: number;
  limit?: number;
}

// Hook to fetch graduates with filters
export function useGraduates(filters: GraduateFilters = {}) {
  return useQuery({
    queryKey: ["graduates", filters],
    queryFn: async (): Promise<GraduatesResponse> => {
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "all")
        params.append("status", filters.status);
      if (filters.zone && filters.zone !== "all")
        params.append("zone", filters.zone);
      if (filters.gender && filters.gender !== "all")
        params.append("gender", filters.gender);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/admin/graduates?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch graduates");
      }

      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 3,
  });
}

// Hook to fetch a single graduate's detailed information
export function useGraduate(graduateId?: string) {
  return useQuery({
    queryKey: ["graduate", graduateId],
    queryFn: async (): Promise<{
      success: boolean;
      graduate: DetailedGraduate;
    }> => {
      if (!graduateId) throw new Error("Graduate ID is required");

      const response = await fetch(`/api/admin/graduates/${graduateId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch graduate");
      }

      return response.json();
    },
    enabled: !!graduateId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for graduate actions (approve, reject, update status, etc.)
export function useGraduateActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      graduateId,
      action,
      data,
    }: {
      graduateId: string;
      action: string;
      data?: any;
    }) => {
      const response = await fetch(`/api/admin/graduates/${graduateId}`, {
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
      // Update the graduate in the cache
      queryClient.setQueryData(["graduate", variables.graduateId], {
        success: true,
        graduate: data.graduate,
      });

      // Invalidate graduates list to refresh
      queryClient.invalidateQueries({ queryKey: ["graduates"] });

      // Success toast
      const actionMessages = {
        update_status: "Status updated successfully",
        approve: "Graduate approved successfully",
        reject: "Graduate rejected",
        start_service: "Service started successfully",
        complete_service: "Service completed successfully",
        add_comments: "Comments added successfully",
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

// Hook for bulk graduate actions
export function useBulkGraduateActions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      graduateIds,
      data,
    }: {
      action: string;
      graduateIds: string[];
      data?: any;
    }) => {
      const response = await fetch("/api/admin/graduates/bulk-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, graduateIds, data }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Bulk action failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate all graduate-related queries
      queryClient.invalidateQueries({ queryKey: ["graduates"] });

      toast.success(data.message);
    },
    onError: (error: Error) => {
      toast.error(`Bulk action failed: ${error.message}`);
    },
  });
}

// Hook for graduate statistics
export function useGraduateStats() {
  return useQuery({
    queryKey: ["graduate-stats"],
    queryFn: async (): Promise<GraduateStats> => {
      const response = await fetch("/api/admin/graduates?limit=1"); // Get minimal data just for stats
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Failed to fetch graduate statistics"
        );
      }

      const data = await response.json();
      return data.stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
}

// Custom hook that combines multiple graduate management hooks
export function useGraduateManagement(filters: GraduateFilters = {}) {
  const graduatesQuery = useGraduates(filters);
  const graduateActions = useGraduateActions();
  const bulkActions = useBulkGraduateActions();

  return {
    // Data
    graduates: graduatesQuery.data?.graduates || [],
    stats: graduatesQuery.data?.stats,
    zones: graduatesQuery.data?.zones || [],
    pagination: graduatesQuery.data?.pagination,

    // Loading states
    isLoading: graduatesQuery.isLoading,
    isRefreshing: graduatesQuery.isFetching,

    // Error states
    isError: graduatesQuery.isError,
    error: graduatesQuery.error,

    // Actions
    refetch: graduatesQuery.refetch,
    performAction: graduateActions.mutate,
    performBulkAction: bulkActions.mutate,

    // Action states
    isPerformingAction: graduateActions.isPending,
    isPerformingBulkAction: bulkActions.isPending,
  };
}
