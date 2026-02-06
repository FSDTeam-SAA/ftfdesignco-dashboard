import axiosInstance from "@/instance/axios-instance";
import { CommonUserResponse, UpdateUserData, UserResponse } from "../types";

// Get All Users
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
): Promise<UserResponse> => {
  const response = await axiosInstance.get("/user/all-users", {
    params: { page, limit },
  });
  return response.data;
};

// Edit User
export const editUser = async (
  id: string,
  data: UpdateUserData,
): Promise<CommonUserResponse> => {
  const response = await axiosInstance.patch(`/user/update/${id}`, data);
  return response.data;
};

// Delete User
export const deleteUser = async (id: string): Promise<CommonUserResponse> => {
  const response = await axiosInstance.delete(`/user/delete/${id}`);
  return response.data;
};
