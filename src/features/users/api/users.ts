import axiosInstance from "@/instance/axios-instance";
import {
  AddUserData,
  CommonUserResponse,
  CSVImportResponse,
  UpdateUserData,
  UserResponse,
} from "../types";

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

// add user
export const addUser = async (
  data: AddUserData,
): Promise<CommonUserResponse> => {
  const response = await axiosInstance.post("/user/register", data);
  return response.data;
};

// add Multiple Users in CSV
export const addMultipleUsers = async (
  data: FormData,
): Promise<CSVImportResponse> => {
  const response = await axiosInstance.post("/user/employer-register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// download users as CSV
export const downloadUsersCSV = async (search: string = "") => {
  const response = await axiosInstance.get("/user/export/csv", {
    params: { search },
    responseType: "blob",
  });
  return response.data;
};

// download users as PDF
export const downloadUsersPDF = async (search: string = "") => {
  const response = await axiosInstance.get("/user/export/pdf", {
    params: { search },
    responseType: "blob",
  });
  return response.data;
};
