import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addMultipleUsers,
  addUser,
  deleteUser,
  editUser,
  getUsers,
} from "../api/users";
import { AddUserData, UpdateUserData } from "../types";

// Get All Users
export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getUsers(page, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

// Edit User
export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      editUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Delete User
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Add User
export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddUserData) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// add multiple users
export const useAddMultipleUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => addMultipleUsers(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
