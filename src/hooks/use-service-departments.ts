// src/hooks/use-service-departments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface ServiceDepartment {
  id: string;
  name: string;
  email: string;
  type: string;
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  staffCounts: number;
}

export interface ServiceDepartmentsResponse {
  success: boolean;
  results: ServiceDepartment[];
}

// Hook to fetch list of service departments for VGSS Office
export function useServiceDepartments() {
  return useQuery({
    queryKey: ["service-departments"],
    queryFn: async (): Promise<ServiceDepartmentsResponse> => {
      const response = await axios.get("/api/vgss-office/service-departments");
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });
}

// Hook to toggle department activation status
export function useToggleDepartmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      departmentId,
      isDeactivated,
    }: {
      departmentId: string;
      isDeactivated: boolean;
    }) => {
      const response = await axios.patch(`/api/admin/users/${departmentId}`, {
        isDeactivated,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-departments"] });
    },
  });
}
