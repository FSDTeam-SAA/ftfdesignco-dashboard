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
  try {
    const response = await axiosInstance.post("/product/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
