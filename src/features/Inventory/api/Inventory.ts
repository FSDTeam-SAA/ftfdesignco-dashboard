// features/Inventory/api/Inventory.api.ts

import axiosInstance from "@/instance/axios-instance";

// get all inventory with pagination
export const getInventory = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  try {
    const response = await axiosInstance.get(
      `/product/inventories?page=${page}&limit=${limit}&search=${search}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
