// src/hooks/use-blw-zone-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface BLWZoneStats {
  totalUploadedGraduates: number;
  totalRegisteredGraduates: number;
  totalInServiceGraduates: number;
  totalPendingRegisteredGraduates: number;
  totalChapters: number;
  statusBreakdown: {
    "Under Review": number;
    "Invited For Interview": number;
    Interviewed: number;
    Sighting: number;
    Serving: number;
    "Not Accepted": number;
  };
}

export interface RecentUpload {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  graduatePhoneNumber: string;
  nameOfUniversity: string;
  courseOfStudy: string;
  isRegistered: boolean | null;
  createdAt: string;
  chapterName: string | null;
}

export interface RecentRegistration {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  email: string;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  createdAt: string;
  chapterName: string | null;
}

export interface BLWZoneDashboardResponse {
  success: boolean;
  stats: BLWZoneStats;
  recentUploads: RecentUpload[];
  recentRegistrations: RecentRegistration[];
}

// Hook to fetch BLW Zone dashboard data
export function useBLWZoneDashboard() {
  return useQuery({
    queryKey: ["blw-zone-dashboard"],
    queryFn: async (): Promise<BLWZoneDashboardResponse> => {
      const response = await axios.get("/api/blw-zone/dashboard-stats");
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}
