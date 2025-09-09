import { User } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";

export interface BLWZoneUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  accountStatus: "pending_activation" | "active";
  isDeactivated: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  // Zone statistics
  totalGraduatesUploaded: number;
  registeredGraduates: number;
  // pendingGraduates?: number;
  recentUploads?: number;
  lastUploadDate?: string;
}

export function useBlwZoneUsers() {
  return useQuery({
    queryKey: ["blw-zone-users"],
    queryFn: async (): Promise<any> => {
      const response = await fetch("/api/vgss-office/blw-zones");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.json();
    },
  });
}
