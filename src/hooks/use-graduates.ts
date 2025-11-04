import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateGraduate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/admin/graduates", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Failed to create graduate");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["graduates"] });
    },
  });
}
