// src/features/dashboard/hooks/useAnalytics.ts
import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../api/Inventory";

export const useInventory = (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  return useQuery({
    queryKey: ["inventory", page, limit, search],
    queryFn: () => getInventory(page, limit, search),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
