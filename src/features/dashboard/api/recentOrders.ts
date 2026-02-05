// features/dashboard/api/recentOrders.api.ts

import axiosInstance from "@/instance/axios-instance";

// get all orders with pagination
export const getRecentOrders = async () => {
  try {
    const response = await axiosInstance.get("/order/get-all?page=1&limit=5");
    return response.data;
  } catch (error) {
    throw error;
  }
};
