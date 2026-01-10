// src/hooks/use-assigned-staff.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface AssignedStaff {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  email: string | null;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string | null;
  maritalStatus: "SINGLE" | "MARRIED" | null;
  dateOfBirth: string | null;
  stateOfOrigin: string | null;
  homeAddress: string | null;
  nameOfUniversity: string | null;
  courseOfStudy: string | null;
  graduationYear: number | null;
  grade: string | null;
  nyscStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED" | null;
  nameOfZone: string | null;
  skillsPossessed: string | null;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  serviceStartedDate: string | null;
  serviceCompletedDate: string | null;
  photo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssignedStaffDetail extends AssignedStaff {
  placeOfBirth: string | null;
  preferredCityOfPosting: string | null;
  accommodation: string | null;
  whereAccommodation: string | null;
  kindAccommodation: string | null;
  chapterId: string | null;
  chapterName: string | null;
  nameOfZonalPastor: string | null;
  nameOfChapterPastor: string | null;
  phoneNumberOfChapterPastor: string | null;
  emailOfChapterPastor: string | null;
  leadershipRolesInMinistryAndFellowship: string | null;
  ministryProgramsAttended: string | null;
}

export interface StaffStats {
  total: number;
  serving: number;
  completed: number;
  male: number;
  female: number;
}

export interface StaffListResponse {
  success: boolean;
  staff: AssignedStaff[];
  stats: StaffStats;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StaffDetailResponse {
  success: boolean;
  staff: AssignedStaffDetail;
}

interface UseAssignedStaffParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// Hook to fetch list of assigned staff
export function useAssignedStaff(params: UseAssignedStaffParams = {}) {
  const { page = 1, limit = 10, search = "", status = "all" } = params;

  return useQuery({
    queryKey: ["assigned-staff", page, limit, search, status],
    queryFn: async (): Promise<StaffListResponse> => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) searchParams.set("search", search);
      if (status && status !== "all") searchParams.set("status", status);

      const response = await axios.get(
        `/api/service-department/staff?${searchParams.toString()}`
      );
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

// Hook to fetch a single staff member's details
export function useStaffDetail(staffId: string | null) {
  return useQuery({
    queryKey: ["staff-detail", staffId],
    queryFn: async (): Promise<StaffDetailResponse> => {
      const response = await axios.get(
        `/api/service-department/staff/${staffId}`
      );
      return response.data;
    },
    enabled: !!staffId,
    staleTime: 60000, // 1 minute
  });
}
