// features/dashboard/api/recentOrders.api.ts

import axiosInstance from "@/instance/axios-instance";

/**
 * Get Recent Orders with optional search and pagination
 */
export const getRecentOrders = async (
  page: number = 1,
  limit: number = 10,
  searchTerm: string = "",
  region: string = "",
) => {
  const response = await axiosInstance.get("/order/get-all", {
    params: {
      searchTerm: searchTerm || undefined,
      page,
      limit,
      region: region || undefined,
    },
  });
  return response.data;
};

//  Delete Order
export const deleteOrder = async (id: string) => {
  const response = await axiosInstance.delete(`/order/${id}`);
  return response.data;
};
