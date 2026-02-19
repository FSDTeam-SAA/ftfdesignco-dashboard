"use client";
import { useState } from "react";
import { isAxiosError } from "axios";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import { useDebounce } from "@/hooks/useDebounce";
import { Product, ProductFilters } from "../types";
import Pagination from "@/components/shared/Pagination";
import AddProductModal from "./AddProductModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProductMainImage } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ProductDetailsModal from "./ProductDetailsModal";
import EditProductModal from "./EditProductModal";
import Image from "next/image";
import { Plus, Eye, PencilLine, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { useCategories } from "@/features/category/hooks/useCategory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const parseSearchString = (input: string): ProductFilters => {
  const parts = input.trim().split(/\s+/);
  const searchTerms: string[] = [];
  const numbers: number[] = [];

  parts.forEach((part) => {
    if (!isNaN(Number(part)) && part !== "") {
      numbers.push(Number(part));
    } else {
      searchTerms.push(part);
    }
  });

  return {
    searchTerm: searchTerms.join(" "),
    price: numbers[0],
    availableQuantity: numbers[1],
  };
};

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  const filters = useMemo(() => {
    const baseFilters = parseSearchString(debouncedSearchQuery);
    return {
      ...baseFilters,
      roleTitle: selectedRole || undefined,
    };
  }, [debouncedSearchQuery, selectedRole]);

  const { data, isLoading, error } = useProducts(
    currentPage,
    itemsPerPage,
    filters,
  );
  const rawProducts: Product[] = data?.data || [];

  // If the API doesn't provide pagination metadata, we assume it returned all products
  // and handle pagination client-side.
  const pagination = data?.pagination || {
    total: rawProducts.length,
    page: currentPage,
    limit: itemsPerPage,
    totalPages: Math.ceil(rawProducts.length / itemsPerPage) || 1,
  };

  // If we're doing client-side pagination (no metadata from API), slice the array.
  const products = data?.pagination
    ? rawProducts
    : rawProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      );

  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await deleteProduct(id);
      if (response.success) {
        toast.success(response.message || "Product deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete product");
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong while deleting";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  // Handle search change and reset to first page
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role === "all" ? "" : role);
    setCurrentPage(1);
  };

  const renderTableBody = () => {
    if (isLoading) {
      return [...new Array(5)].map((_, i) => (
        <tr key={`skeleton-${i}`} className="bg-white">
          <td colSpan={7} className="px-6 py-4">
            <Skeleton className="h-16 w-full rounded-xl" />
          </td>
        </tr>
      ));
    }

    if (products.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="text-center py-10 text-gray-400">
            No products found.
          </td>
        </tr>
      );
    }

    return products.map((product) => {
      const imageUrl = getProductMainImage(product.images || product.image);

      const statusColor =
        product.status === "active"
          ? "bg-[#D1FAE5] text-[#10B981] hover:bg-[#D1FAE5]"
          : "bg-[#FEE2E2] text-[#EF4444] hover:bg-[#FEE2E2]";

      return (
        <tr
          key={product._id}
          className="bg-white hover:bg-gray-50 transition-colors group"
          style={{
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
          }}
        >
          <td className="px-6 py-4 rounded-l-2xl border-y border-l">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
              <Image
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover"
                width={48}
                height={48}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/placeholder-product.png";
                }}
              />
              {(product.images?.length || 0) > 1 && (
                <div className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded-tl-md">
                  +{product.images!.length - 1}
                </div>
              )}
            </div>
          </td>
          <td className="px-6 py-4 text-gray-700 font-semibold border-y max-w-[200px] truncate">
            {product.title}
          </td>
          <td className="px-6 py-4 text-gray-500 font-medium border-y">
            #{product.sku || product._id.slice(-4).toUpperCase()}
          </td>
          <td className="px-6 py-4 text-center border-y">
            <Badge
              className={`${statusColor} px-4 py-1.5 rounded-lg border-none font-semibold capitalize text-sm`}
            >
              {product.status === "active" ? "Active" : "Deactive"}
            </Badge>
          </td>
          <td className="px-6 py-4 text-center text-gray-900 font-bold border-y">
            ${product.price ? product.price.toLocaleString() : "0"}
          </td>
          <td className="px-6 py-4 text-center text-gray-700 border-y">
            <span
              className={
                product.availableQuantity > 0
                  ? "text-gray-700 font-medium"
                  : "text-red-500 font-medium"
              }
            >
              {product.availableQuantity}
            </span>
          </td>
          <td className="px-6 py-4 text-center rounded-r-2xl border-y border-r">
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => handleViewProduct(product)}
                className="text-emerald-500 hover:text-emerald-700 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg cursor-pointer"
              >
                <Eye size={20} />
              </button>
              <button
                onClick={() => handleEditProduct(product)}
                className="text-emerald-500 hover:text-emerald-700 transition-colors p-1.5 hover:bg-emerald-50 rounded-lg cursor-pointer"
              >
                <PencilLine size={20} />
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="text-red-400 hover:text-red-600 transition-colors p-1.5 hover:bg-red-50 rounded-lg cursor-pointer"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading products. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Products</h1>
          <p className="text-gray-500 font-medium">
            Manage your product inventory and details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search title: Shirt, price: 28"
            className="w-full sm:w-64 h-10"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />

          <Select
            onValueChange={handleRoleChange}
            value={selectedRole || "all"}
          >
            <SelectTrigger className="w-full sm:w-48 h-10 border-gray-200 rounded-lg focus:ring-emerald-500">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-100 shadow-xl rounded-xl">
              <SelectItem
                value="all"
                className="focus:bg-emerald-50 focus:text-emerald-600 rounded-lg"
              >
                All Categories
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem
                  key={cat._id}
                  value={cat.roleTitle}
                  className="focus:bg-emerald-50 focus:text-emerald-600 rounded-lg"
                >
                  {cat.roleTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] font-semibold flex items-center gap-2 border-none shadow-sm w-full sm:w-auto h-10"
          >
            <Plus size={18} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="border p-6 rounded-2xl">
        {/* Table Section */}
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full border-separate border-spacing-y-4 min-w-[1000px]">
            <thead className="bg-transparent">
              <tr className="text-left text-gray-800 font-semibold">
                <th className="px-6 py-2">Image</th>
                <th className="px-6 py-2">Product Name</th>
                <th className="px-6 py-2">SKU</th>
                <th className="px-6 py-2 text-center">Status</th>
                <th className="px-6 py-2 text-center">Price</th>
                <th className="px-6 py-2 text-center">Stock</th>
                <th className="px-6 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="space-y-4">{renderTableBody()}</tbody>
          </table>
        </div>
      </div>
      {/* Pagination Section */}
      <Pagination
        pagination={pagination}
        onPageChange={setCurrentPage}
        onLimitChange={(limit) => {
          setItemsPerPage(limit);
          setCurrentPage(1);
        }}
        itemName="products"
      />

      {/* Details Modal */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />

      {/* Edit Modal */}
      <EditProductModal
        product={selectedProduct}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Add Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
