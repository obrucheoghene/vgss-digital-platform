import { Chapter } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";

export const useChaptersForZone = () => {
  return useQuery({
    queryKey: ["chapters-for-zone"],
    queryFn: async (): Promise<{ chapters: Chapter[] }> => {
      const response = await fetch("/api/blw-zone/chapters");
      if (!response.ok) {
        throw new Error("Failed to fetch chapters for zone");
      }
      return response.json();
    },
  });
};
