"use client";
import { useState } from "react";
import { useCategories, useDeleteCategory } from "../hooks/useCategory";
import { Category as CategoryType } from "../types";
import AddCategoryModal from "./AddCategoryModal";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { toast } from "sonner";
import { isAxiosError } from "axios";
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

export default function Category() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { data, isLoading, error } = useCategories();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const categories: CategoryType[] = data?.data || [];

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await deleteCategory(categoryToDelete);
      if (response.success) {
        toast.success(response.message || "Category deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete category");
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong while deleting";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const renderTableBody = () => {
    if (isLoading) {
      return [...new Array(5)].map((_, i) => (
        <tr key={`category-skeleton-${i}`} className="bg-white">
          <td colSpan={3} className="px-6 py-4">
            <Skeleton className="h-16 w-full rounded-xl" />
          </td>
        </tr>
      ));
    }

    if (categories.length === 0) {
      return (
        <tr>
          <td colSpan={3} className="text-center py-10 text-gray-400">
            No categories found.
          </td>
        </tr>
      );
    }

    return categories.map((category) => (
      <tr
        key={category._id}
        className="bg-white hover:bg-gray-50 transition-colors group"
        style={{
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <td className="px-6 py-4 rounded-l-2xl border-y border-l">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
            {category.images ? (
              <Image
                src={category.images}
                alt={category.roleTitle}
                className="w-full h-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-1">
                No Image
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-gray-700 font-semibold border-y">
          {category.roleTitle}
        </td>
        <td className="px-6 py-4 text-center rounded-r-2xl border-y border-r">
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => handleDeleteClick(category._id)}
              className="text-red-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </td>
      </tr>
    ));
  };

  if (error) {
    return (
      <div className="p-8 text-red-500 text-center">
        <h2 className="text-xl font-semibold mb-2">Error Loading Categories</h2>
        <p>
          {error instanceof Error ? error.message : "Please try again later."}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-white min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Job/Role</h1>
          <p className="text-gray-500 font-medium">
            Manage your product roles and Job
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] font-semibold flex items-center gap-2 border-none shadow-sm w-full sm:w-auto"
        >
          <Plus size={18} />
          Add Job/Role
        </Button>
      </div>

      <div className="border p-6 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full border-separate border-spacing-y-4">
            <thead className="bg-transparent">
              <tr className="text-left text-gray-800 font-semibold">
                <th className="px-6 py-2">Image</th>
                <th className="px-6 py-2">Job / Role</th>
                <th className="px-6 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="space-y-4">{renderTableBody()}</tbody>
          </table>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
      >
        <AlertDialogContent className="rounded-2xl border-none p-6 bg-white shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              This action cannot be undone. This will permanently remove the category/role from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3 flex sm:flex-row flex-col-reverse">
            <AlertDialogCancel className="rounded-xl border-gray-200 font-semibold h-11 px-6">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="rounded-xl bg-red-500 hover:bg-red-600 font-semibold h-11 px-6 border-none text-white"
            >
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
