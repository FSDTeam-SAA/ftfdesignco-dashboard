// src/features/dashboard/hooks/useRecentOrders.ts
import { useQuery } from "@tanstack/react-query";
import { getRecentOrders } from "../api/recentOrders";

// Get Recent Orders hook with optional search
export const useRecentOrders = (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
) => {
  return useQuery({
    queryKey: ["recent-orders", page, limit, searchTerm],
    queryFn: () => getRecentOrders(page, limit, searchTerm),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
