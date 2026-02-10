// features/Inventory/api/Inventory.api.ts

import axiosInstance from "@/instance/axios-instance";

// get all inventory with pagination
export const getInventory = async (
  region: string = "",
) => {
  const response = await axiosInstance.get(
    `/product/rigion/products?rigion=${region}`,
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
