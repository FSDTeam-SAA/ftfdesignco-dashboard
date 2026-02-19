import axiosInstance from "@/instance/axios-instance";
import { CommonResponse, ProductFilters, ProductResponse } from "../types";

// Get All Products
export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  filters: ProductFilters = {},
): Promise<ProductResponse> => {
  const { searchTerm, ...rest } = filters;
  const response = await axiosInstance.get(
    `/product/all?searchTerm=${searchTerm || ""}`,
    {
      params: { page, limit, ...rest },
    },
  );
  return response.data;
};

// edit product
export const editProduct = async (
  id: string,
  data: FormData,
): Promise<CommonResponse> => {
  const response = await axiosInstance.put(`/product/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// product delete
export const deleteProduct = async (id: string): Promise<CommonResponse> => {
  const response = await axiosInstance.delete(`/product/${id}`);
  return response.data;
};

// add product
export const addProduct = async (data: FormData): Promise<CommonResponse> => {
  const response = await axiosInstance.post("/product/create", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// search product
// export const searchProduct = async (search: string): Promise<ProductResponse> => {
//   const response = await axiosInstance.get("/product/search", {
//     params: { search },
//   });
//   return response.data;
// };
