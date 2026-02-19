"use client";
import { useState, useMemo } from "react";
import { isAxiosError } from "axios";
import { useDeleteUser, useUsers } from "../hooks/useUsers";
import { User } from "../types";
import Pagination from "@/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  PencilLine,
  Plus,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import UserDetailsModal from "./UserDetailsModal";
import EditUserModal from "./EditUserModal";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddUserModal from "./AddUserModal";
import ImportUsersModal from "./ImportUsersModal";

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

  // Sorting State
  const [sortField, setSortField] = useState<
    "firstName" | "lastName" | "email" | "role" | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data, isLoading, error } = useUsers(
    currentPage,
    itemsPerPage,
    // search,
  );
  const { mutateAsync: deleteUser } = useDeleteUser();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      const response = await deleteUser(id);
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

  const handleSort = (field: "firstName" | "lastName" | "email" | "role") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortedUsers = useMemo(() => {
    const usersToSort = data?.data || [];
    if (!sortField) return usersToSort;

    return [...usersToSort].sort((a, b) => {
      let valA: string = "";
      let valB: string = "";

      if (sortField === "firstName") {
        valA = a.firstName.toLowerCase();
        valB = b.firstName.toLowerCase();
      } else if (sortField === "lastName") {
        valA = a.lastName.toLowerCase();
        valB = b.lastName.toLowerCase();
      } else if (sortField === "email") {
        valA = a.email.toLowerCase();
        valB = b.email.toLowerCase();
      } else if (sortField === "role") {
        valA = (a.role || "").toLowerCase();
        valB = (b.role || "").toLowerCase();
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data?.data, sortField, sortDirection]);

  const getSortIcon = (field: "firstName" | "lastName" | "email" | "role") => {
    const isActive = sortField === field;
    if (!isActive)
      return <ArrowUpDown size={16} className="ml-1 text-gray-300" />;

    return (
      <div className="flex items-center ml-1 px-2 py-1 bg-green-50 rounded-full border border-emerald-100 text-[#22AD5C] shadow-sm animate-in fade-in zoom-in duration-200">
        {sortDirection === "asc" ? (
          <ChevronUp size={14} className="mr-1" />
        ) : (
          <ChevronDown size={14} className="mr-1" />
        )}
        <span className="text-[10px] font-bold tracking-tight uppercase">
          {sortDirection === "asc" ? "A–Z" : "Z–A"}
        </span>
      </div>
    );
  };

  // If the API doesn't provide pagination metadata, we assume it returned all users
  // and handle pagination client-side.
  const pagination = data?.pagination || {
    total: sortedUsers.length,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: Math.ceil(sortedUsers.length / itemsPerPage) || 1,
  };

  // If we're doing client-side pagination (no metadata from API), slice the array.
  const users = data?.pagination
    ? sortedUsers
    : sortedUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );

  const renderTableBody = () => {
    if (isLoading) {
      return Array.from({ length: 5 }).map((_, i) => (
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

    return (users as User[]).map((user) => {
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
              <button
                onClick={() => {
                  setUserToDelete(user._id);
                  setIsDeleteConfirmOpen(true);
                }}
                title="Delete User"
                className="text-rose-400 hover:text-rose-600 transition-colors p-2 hover:bg-rose-50 rounded-xl cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
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
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <Plus size={20} />
            Add New User
          </button>
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
          >
            <Plus size={20} />
            Add Multiple User
          </button>
        </div>
      </div>

      <div className="bg-white p-2 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-4 min-w-[900px]">
            <thead>
              <tr className="text-left text-gray-400 font-bold text-xs uppercase tracking-wider">
                <th
                  className="px-6 py-2 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("firstName")}
                >
                  <div className="flex items-center">
                    First Name {getSortIcon("firstName")}
                  </div>
                </th>
                <th
                  className="px-6 py-2 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("lastName")}
                >
                  <div className="flex items-center">
                    Last Name {getSortIcon("lastName")}
                  </div>
                </th>
                <th
                  className="px-6 py-2 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email Address {getSortIcon("email")}
                  </div>
                </th>
                <th
                  className="px-6 py-2 cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => handleSort("role")}
                >
                  <div className="flex items-center">
                    Role {getSortIcon("role")}
                  </div>
                </th>
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
          itemName="users"
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

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Import Users Modal */}
      <ImportUsersModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
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
              onClick={() => userToDelete && handleConfirmDelete(userToDelete)}
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
