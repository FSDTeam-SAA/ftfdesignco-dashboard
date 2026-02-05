"use client";
import React, { useState } from "react";
import { useRecentOrders } from "../hooks/useRecentOrders";
import { Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Order } from "../types/index";
import OrderDetailsModal from "./OrderDetailsModal";

export default function RecentOrders() {
  const { data, isLoading, error } = useRecentOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="mt-8 bg-white rounded-2xl p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-[#22AD5C] text-2xl font-semibold mb-1">
          Recent Orders
        </h2>
        <p className="text-gray-400 text-lg">
          Get the information of car dealers
        </p>
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

      <OrderDetailsModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
