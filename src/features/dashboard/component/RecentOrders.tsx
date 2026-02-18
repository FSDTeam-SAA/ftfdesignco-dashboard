"use client";
import React, { useState } from "react";
import { useRecentOrders } from "../hooks/useRecentOrders";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@/components/shared/Pagination";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "../types/index";
import OrderDetailsModal from "./OrderDetailsModal";
import { regionalOffice } from "@/features/Inventory/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [region, setRegion] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data, isLoading, error } = useRecentOrders(
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    region,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRegionChange = (value: string) => {
    setRegion(value === "all" ? "" : value);
    setCurrentPage(1);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <p className="text-red-500">
          Error loading recent orders. Please try again later.
        </p>
      </div>
    );
  }

  const orders = data?.data || [];
  const pagination = {
    total: data?.meta?.total || 0,
    page: data?.meta?.page || 1,
    limit: data?.meta?.limit || itemsPerPage,
    totalPages: data?.meta?.totalPage || 0,
  };

  return (
    <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="mb-4 sm:mb-8">
          <h2 className="text-[#22AD5C] text-2xl font-semibold mb-1">
            Recent Orders
          </h2>
          <p className="text-gray-400 text-lg">
            Get the information of recent orders
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Region Filter */}
          <div className="w-full sm:w-64">
            <Select onValueChange={handleRegionChange} value={region || "all"}>
              <SelectTrigger className="w-full h-10 border-gray-200 rounded-xl focus:ring-[#22AD5C] focus:border-[#22AD5C] bg-white">
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg rounded-xl">
                <SelectItem
                  value="all"
                  className="focus:bg-green-50 focus:text-[#22AD5C]"
                >
                  All Regions
                </SelectItem>
                {regionalOffice.map((office) => (
                  <SelectItem
                    key={office}
                    value={office}
                    className="focus:bg-green-50 focus:text-[#22AD5C]"
                  >
                    {office}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#22AD5C] focus:border-[#22AD5C] sm:text-sm transition-all h-10"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search orders"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-500 font-medium">
              <th className="pb-6 px-4 text-center text-lg font-medium text-gray-400">
                User ID
              </th>
              <th className="pb-6 px-4 text-center text-lg font-medium text-gray-400">
                User&apos;s Name
              </th>
              <th className="pb-6 px-4 text-center text-lg font-medium text-gray-400">
                Ordered Date
              </th>
              <th className="pb-6 px-4 text-center text-lg font-medium text-gray-400">
                User&apos;s Email
              </th>
              <th className="pb-6 px-4 text-center text-lg font-medium text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((order: Order, index: number) => (
                <tr
                  key={order._id || index}
                  className={`${index % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"} hover:bg-gray-50 transition-colors`}
                >
                  <td className="py-4 px-4 text-center text-md font-medium text-gray-600 rounded-l-lg">
                    {`#${order._id.slice(-4)}`}
                  </td>
                  <td className="py-4 px-4 text-center text-md font-medium text-gray-600">
                    {order.user
                      ? `${order.user.firstName} ${order.user.lastName}`
                      : "Guest Dealer"}
                  </td>
                  <td className="py-4 px-4 text-center text-md font-medium text-gray-600">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="py-4 px-4 text-center text-md font-medium text-gray-600">
                    {order.user?.email || "N/A"}
                  </td>
                  <td className="py-4 px-4 text-center rounded-r-lg">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-[#22AD5C] hover:bg-green-50 p-2 rounded-full transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      <Eye size={24} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
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
        itemName="orders"
      />

      <OrderDetailsModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
