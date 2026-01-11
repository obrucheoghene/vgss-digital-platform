// src/hooks/use-graduate-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface GraduateProfile {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  email: string;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string | null;
  maritalStatus: "SINGLE" | "MARRIED" | null;
  placeOfBirth: string | null;
  dateOfBirth: string | null;
  stateOfOrigin: string | null;
  homeAddress: string | null;
  preferredCityOfPosting: string | null;
  nameOfZone: string | null;
  chapterId: string | null;
  chapterName: string | null;
  nameOfZonalPastor: string | null;
  nameOfChapterPastor: string | null;
  nameOfUniversity: string | null;
  courseOfStudy: string | null;
  graduationYear: number | null;
  grade: string | null;
  nyscStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED" | null;
  skillsPossessed: string | null;
  leadershipRolesInMinistryAndFellowship: string | null;
  ministryProgramsAttended: string | null;
  photo: string | null;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  serviceStartedDate: string | null;
  serviceCompletedDate: string | null;
  serviceDepartmentId: string | null;
  serviceDepartmentName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GraduateStats {
  serviceProgress: number;
  serviceDaysCompleted: number;
  totalServiceDays: number;
  profileCompletion: number;
}

export interface GraduateDashboardResponse {
  success: boolean;
  graduate: GraduateProfile;
  stats: GraduateStats;
}

// Hook to fetch graduate dashboard data
export function useGraduateDashboard() {
  return useQuery({
    queryKey: ["graduate-dashboard"],
    queryFn: async (): Promise<GraduateDashboardResponse> => {
      const response = await axios.get("/api/graduate/dashboard");
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
}
