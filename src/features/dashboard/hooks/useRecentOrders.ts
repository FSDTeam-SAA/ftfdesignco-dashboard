// src/features/dashboard/hooks/useRecentOrders.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteOrder, getRecentOrders } from "../api/recentOrders";

// Get Recent Orders hook with optional search
export const useRecentOrders = (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  region: string = "",
) => {
  return useQuery({
    queryKey: ["recent-orders", page, limit, searchTerm, region],
    queryFn: () => getRecentOrders(page, limit, searchTerm, region),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};


//  Delete Order hook
export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
  });
};