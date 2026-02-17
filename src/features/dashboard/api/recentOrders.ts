// features/dashboard/api/recentOrders.api.ts

import axiosInstance from "@/instance/axios-instance";

export const getRecentOrders = async (page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/order/get-all?page=${page}&limit=${limit}`);
  return response.data;
};

// /order/get-all?searchTerm=Addison

// get all with search params

export const getallsearch = async (searchTerm: string, page: number = 1, limit: number = 10) => {
  const response = await axiosInstance.get(`/order/get-all?searchTerm=${searchTerm}&page=${page}&limit=${limit}`);
  return response.data;
};
