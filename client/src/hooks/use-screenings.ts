import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertScreening } from "@shared/routes";

export function useCreateScreening() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertScreening) => {
      const res = await fetch(api.screenings.create.path, {
        method: api.screenings.create.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error('Failed to save screening results');
      }
      
      const json = await res.json();
      return api.screenings.create.responses[201].parse(json);
    },
    onSuccess: () => {
      // Invalidate relevant queries if we had a list view
      // queryClient.invalidateQueries({ queryKey: [api.screenings.list.path] });
    },
  });
}
