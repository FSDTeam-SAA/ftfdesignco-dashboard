// src/features/dashboard/hooks/useRecentOrders.ts
import { useQuery } from "@tanstack/react-query";
import { getRecentOrders, getallsearch } from "../api/recentOrders";

// Get Recent Orders hook
export const useRecentOrders = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["recent-orders", page, limit],
    queryFn: () => getRecentOrders(page, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// Search Recent Orders hook
export const useRecentOrdersSearch = (searchTerm: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["recent-orders-search", searchTerm, page, limit],
    queryFn: () => getallsearch(searchTerm, page, limit),
    enabled: searchTerm.length > 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
