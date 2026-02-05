// src/features/dashboard/hooks/useRecentOrders.ts
import { useQuery } from "@tanstack/react-query";
import { getRecentOrders } from "../api/recentOrders";

// Get Recent Orders hook
export const useRecentOrders = () => {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: getRecentOrders,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
