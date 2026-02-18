// features/dashboard/api/recentOrders.api.ts

import axiosInstance from "@/instance/axios-instance";

/**
 * Get Recent Orders with optional search and pagination
 */
export const getRecentOrders = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
) => {
  const response = await axiosInstance.get("/order/get-all", {
    params: {
      searchTerm: searchTerm || undefined,
      page,
      limit,
    },
  });
  return response.data;
};
