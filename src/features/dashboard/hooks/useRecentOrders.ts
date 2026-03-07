// src/features/dashboard/hooks/useRecentOrders.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, getRecentOrders, updateOrderStatus } from "../api/recentOrders";

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

// Update Order Status hook
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recent-orders"] });
    },
  });
};