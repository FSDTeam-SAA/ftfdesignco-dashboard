import axiosInstance from "@/instance/axios-instance";
import {
  CommonResponse,
  ProductResponse,
  UpdateProductData,
  CreateProductData,
} from "../types";

// Get All Products
export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  // search: string = "",
): Promise<ProductResponse> => {
  const response = await axiosInstance.get("/product/all", {
    params: { page, limit },
  });
  return response.data;
};

// edit product
export const editProduct = async (
  id: string,
  data: UpdateProductData,
): Promise<CommonResponse> => {
  const response = await axiosInstance.put(`/product/${id}`, data);
  return response.data;
};

// product delete
export const deleteProduct = async (id: string): Promise<CommonResponse> => {
  const response = await axiosInstance.delete(`/product/${id}`);
  return response.data;
};

// add product
export const addProduct = async (
  data: CreateProductData,
): Promise<CommonResponse> => {
  const response = await axiosInstance.post("/product/create", data);
  return response.data;
};
// download products as CSV
export const downloadProductsCSV = async (search: string = "") => {
  const response = await axiosInstance.get("/product/export/csv", {
    params: { search },
    responseType: "blob",
  });
  return response.data;
};

// download products as PDF
export const downloadProductsPDF = async (search: string = "") => {
  const response = await axiosInstance.get("/product/export/pdf", {
    params: { search },
    responseType: "blob",
  });
  return response.data;
};
