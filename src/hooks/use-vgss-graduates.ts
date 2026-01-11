// src/hooks/use-vgss-graduates.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Graduate {
  id: string;
  userId: string;
  graduateFirstname: string;
  graduateSurname: string;
  email: string;
  graduateGender: "MALE" | "FEMALE";
  dateOfBirth: string | null;
  graduatePhoneNumber: string | null;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  isApproved: boolean;
  nameOfUniversity: string | null;
  courseOfStudy: string | null;
  graduationYear: number | null;
  grade: string | null;
  nameOfZone: string | null;
  chapterId: string | null;
  nameOfChapterPastor: string | null;
  serviceStartedDate: string | null;
  serviceCompletedDate: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
  zoneName: string | null;
  zoneEmail: string | null;
}

export interface GraduateDetail extends Graduate {
  graduateLastname: string | null; // API returns this instead of graduateSurname
  maritalStatus: string | null;
  stateOfOrigin: string | null;
  homeAddress: string | null;
  placeOfBirth: string | null;
  preferredCityOfPosting: string | null;
  nyscStatus: string | null;
  skillsPossessed: string | null;
  leadershipRolesInMinistryAndFellowship: string | null;
  ministryProgramsAttended: string | null;
  visionMissionPurpose: string | null;
  whyVgss: string | null;
  plansAfterVgss: string | null;
  chapterName: string | null;
  photo: string | null;
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

export interface GraduateDetailResponse {
  success: boolean;
  graduate: GraduateDetail;
}

interface UseVGSSGraduatesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  gender?: string;
  zone?: string;
}

// Hook to fetch list of graduates for VGSS Office
export function useVGSSGraduates(params: UseVGSSGraduatesParams = {}) {
  const {
    page = 1,
    limit = 20,
    search = "",
    status = "all",
    gender = "all",
    zone = "all",
  } = params;

  return useQuery({
    queryKey: ["vgss-graduates", page, limit, search, status, gender, zone],
    queryFn: async (): Promise<GraduatesResponse> => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) searchParams.set("search", search);
      if (status && status !== "all") searchParams.set("status", status);
      if (gender && gender !== "all") searchParams.set("gender", gender);
      if (zone && zone !== "all") searchParams.set("zone", zone);

      const response = await axios.get(
        `/api/admin/graduates?${searchParams.toString()}`
      );
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

// Hook to fetch a single graduate's details
export function useGraduateDetail(graduateId: string | null) {
  return useQuery({
    queryKey: ["graduate-detail", graduateId],
    queryFn: async (): Promise<GraduateDetailResponse> => {
      const response = await axios.get(`/api/admin/graduates/${graduateId}`);
      return response.data;
    },
    enabled: !!graduateId,
    staleTime: 60000, // 1 minute
  });
}

// Hook to update graduate status
export function useUpdateGraduateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      graduateId,
      status,
      comments,
    }: {
      graduateId: string;
      status: string;
      comments?: string;
    }) => {
      const response = await axios.patch(`/api/admin/graduates/${graduateId}`, {
        action: "update_status",
        status,
        comments,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vgss-graduates"] });
      queryClient.invalidateQueries({ queryKey: ["graduate-detail"] });
    },
  });
}

// Hook to approve graduate
export function useApproveGraduate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      graduateId,
      comments,
    }: {
      graduateId: string;
      comments?: string;
    }) => {
      const response = await axios.patch(`/api/admin/graduates/${graduateId}`, {
        action: "approve",
        comments,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vgss-graduates"] });
      queryClient.invalidateQueries({ queryKey: ["graduate-detail"] });
    },
  });
}

// Hook to reject graduate
export function useRejectGraduate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      graduateId,
      comments,
    }: {
      graduateId: string;
      comments?: string;
    }) => {
      const response = await axios.patch(`/api/admin/graduates/${graduateId}`, {
        action: "reject",
        comments,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vgss-graduates"] });
      queryClient.invalidateQueries({ queryKey: ["graduate-detail"] });
    },
  });
}

// Hook to bulk update graduate statuses
export function useBulkUpdateGraduates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      graduateIds,
      status,
    }: {
      graduateIds: string[];
      status: string;
    }) => {
      const response = await axios.patch("/api/admin/graduates/bulk", {
        graduateIds,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vgss-graduates"] });
    },
  });
}
