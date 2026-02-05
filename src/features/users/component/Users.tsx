"use client";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useDeleteUser, useUsers } from "../hooks/useUsers";
import { User } from "../types";
import Pagination from "./Pagination";
import { Badge } from "@/components/ui/badge";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import UserDetailsModal from "./UserDetailsModal";
import EditUserModal from "./EditUserModal";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, error } = useUsers(currentPage, itemsPerPage);
  const users: User[] = data?.data || [];

  const pagination = data?.pagination || {
    total: 0,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: 1,
  };

  const { mutateAsync: deleteUser } = useDeleteUser();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await deleteUser(userToDelete);
      if (response.success) {
        toast.success(response.message || "User deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong while deleting";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const renderTableBody = () => {
    if (isLoading) {
      return [...new Array(5)].map((_, i) => (
        <tr key={`skeleton-${i}`} className="bg-white">
          <td colSpan={5} className="px-6 py-4">
            <Skeleton className="h-16 w-full rounded-xl" />
          </td>
        </tr>
      ));
    }

    if (users.length === 0) {
      return (
        <tr>
          <td
            colSpan={5}
            className="text-center py-10 text-gray-400 font-medium"
          >
            No users found.
          </td>
        </tr>
      );
    }

    return users.map((user) => {
      const roleColor =
        user.role === "owner"
          ? "text-purple-600 bg-purple-50"
          : user.role === "admin"
            ? "text-blue-600 bg-blue-50"
            : "text-emerald-600 bg-emerald-50";

      return (
        <tr
          key={user._id}
          className="bg-white hover:bg-gray-50 transition-colors group"
          style={{
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <td className="px-6 py-4 rounded-l-2xl border-y border-l">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                <AvatarImage src={user.profileImage} />
                <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold text-xs">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-gray-900 font-bold leading-tight">
                  {user.firstName}
                </span>
                <span className="text-gray-400 text-xs font-medium">
                  #{user._id.slice(-6)}
                </span>
              </div>
            </div>
          </td>
          <td className="px-6 py-4 text-gray-700 font-semibold border-y">
            {user.lastName}
          </td>
          <td className="px-6 py-4 text-gray-500 font-medium border-y">
            {user.email}
          </td>
          <td className="px-6 py-4 border-y">
            <Badge
              className={`${roleColor} px-3 py-1 rounded-lg border-none font-bold capitalize text-xs shadow-none hover:opacity-80`}
            >
              {user.role}
            </Badge>
          </td>
          <td className="px-6 py-4 text-center rounded-r-2xl border-y border-r">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handleViewUser(user)}
                title="View Details"
                className="text-emerald-500 hover:text-emerald-700 transition-colors p-2 hover:bg-emerald-50 rounded-xl cursor-pointer"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEditUser(user)}
                title="Edit User"
                className="text-emerald-500 hover:text-emerald-700 transition-colors p-2 hover:bg-emerald-50 rounded-xl cursor-pointer"
              >
                <PencilLine size={18} />
              </button>
              {/* <button
                onClick={() => handleDeleteClick(user._id)}
                title="Delete User"
                className="text-rose-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-xl cursor-pointer"
              >
                <Trash2 size={18} />
              </button> */}
            </div>
          </td>
        </tr>
      );
    });
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4">
          !
        </div>
        <h3 className="text-lg font-bold text-gray-900">Error loading users</h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-1">
          Please check your connection and try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#FAFAFA] min-h-full rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            View, manage and update user information securely.
          </p>
        </div>
      </div>

      <div className="bg-white p-2 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4 min-w-[900px]">
            <thead>
              <tr className="text-left text-gray-400 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-2">First Name</th>
                <th className="px-6 py-2">Last Name</th>
                <th className="px-6 py-2">Email Address</th>
                <th className="px-6 py-2">Role</th>
                <th className="px-6 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="space-y-4 pt-4">{renderTableBody()}</tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <Pagination
          pagination={pagination}
          onPageChange={setCurrentPage}
          onLimitChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent className="rounded-3xl border-none p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Delete User Account?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently remove the
              user from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl border-gray-200 font-semibold h-11">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 font-semibold h-11 border-none shadow-lg shadow-rose-100"
            >
              Yes, Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
