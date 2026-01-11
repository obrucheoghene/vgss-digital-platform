// src/hooks/use-service-department-dashboard.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface AssignedStaff {
  id: string;
  graduateFirstname: string;
  graduateSurname: string;
  email: string;
  graduateGender: "MALE" | "FEMALE";
  graduatePhoneNumber: string | null;
  status:
    | "Under Review"
    | "Invited For Interview"
    | "Interviewed"
    | "Sighting"
    | "Serving"
    | "Not Accepted";
  serviceStartedDate: string | null;
  serviceCompletedDate: string | null;
  courseOfStudy: string | null;
  nameOfUniversity: string | null;
  chapterName: string | null;
  serviceProgress: number;
  serviceDaysCompleted: number;
  totalServiceDays: number;
}

export interface StaffRequest {
  id: string;
  positionTitle: string;
  numberOfStaff: number;
  urgency: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled" | "Cancelled";
  fulfilledCount: number;
  createdAt: string;
}

export interface DepartmentInfo {
  name: string;
  email: string;
  createdAt: string;
}

export interface DepartmentStats {
  totalStaff: number;
  activeStaff: number;
  pendingRequests: number;
  approvedRequests: number;
  fulfilledRequests: number;
  totalRequests: number;
}

export interface ServiceDepartmentDashboardResponse {
  success: boolean;
  department: DepartmentInfo;
  stats: DepartmentStats;
  staff: AssignedStaff[];
  recentRequests: StaffRequest[];
}

// Hook to fetch service department dashboard data
export function useServiceDepartmentDashboard() {
  return useQuery({
    queryKey: ["service-department-dashboard"],
    queryFn: async (): Promise<ServiceDepartmentDashboardResponse> => {
      const response = await axios.get("/api/service-department/dashboard");
      return response.data;
    },
    staleTime: 60000, // 1 minute
  });
}
