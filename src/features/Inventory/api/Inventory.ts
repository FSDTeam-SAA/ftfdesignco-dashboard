// features/Inventory/api/Inventory.api.ts

import axiosInstance from "@/instance/axios-instance";

// get all inventory with pagination
export const getInventory = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  const response = await axiosInstance.get(
    `/product/inventories?page=${page}&limit=${limit}&search=${search}`,
  );
  return response.data;
};
// download inventory as CSV
export const downloadInventoryCSV = async (search: string = "") => {
  const response = await axiosInstance.get("/product/inventories/export/csv", {
    params: { search },
    responseType: "blob",
  });
  return response.data;
};

// download inventory as PDF
export const downloadInventoryPDF = async (search: string = "") => {
  const response = await axiosInstance.get("/product/inventories/export/pdf", {
    params: { search },
    responseType: "blob",
  });
  return response.data;
};
