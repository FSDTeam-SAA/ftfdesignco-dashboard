// features/dashboard/api/category.api.ts

import axiosInstance from "@/instance/axios-instance";
import { CategoryResponse, SingleCategoryResponse } from "../types";

// Get all categories
export const getCategories = async (): Promise<CategoryResponse> => {
  try {
    const response = await axiosInstance.get("/role/");
    console.log("Categories API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Add new category
export const addCategory = async (
  formData: FormData,
): Promise<SingleCategoryResponse> => {
  try {
    const response = await axiosInstance.post("/role/create-role", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (
  id: string,
): Promise<SingleCategoryResponse> => {
  try {
    const response = await axiosInstance.delete(`/role/delete-role/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
