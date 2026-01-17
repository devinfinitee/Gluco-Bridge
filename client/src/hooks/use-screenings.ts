import type { InsertScreening } from "@shared/schema";

export function useCreateScreening() {
  // Frontend-only: Store screening data to localStorage
  return {
    mutate: (data: InsertScreening) => {
      localStorage.setItem('currentScreening', JSON.stringify(data));
    },
    mutateAsync: async (data: InsertScreening) => {
      localStorage.setItem('currentScreening', JSON.stringify(data));
      return data;
    },
    isPending: false,
  };
}
