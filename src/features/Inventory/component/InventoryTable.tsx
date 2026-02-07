"use client";

import React from "react";
import { InventoryItem } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
}

export default function InventoryTable({
  items,
  isLoading,
}: InventoryTableProps) {
  const getImageUrl = (image: string | { url: string }) => {
    if (typeof image === "string") return image;
    return image?.url;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="space-y-4">
          {[...new Array(5)].map((_, i) => (
            <Skeleton
              key={`skeleton-${i}`}
              className="h-20 w-full rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-2 md:p-6 rounded-4xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-4 min-w-[900px]">
          <thead>
            <tr className="text-left text-gray-400 font-bold text-xs uppercase tracking-wider">
              <th className="px-6 py-2 w-20"></th>
              <th className="px-6 py-2">Oder Id</th>
              <th className="px-6 py-2 text-center">SKU</th>
              <th className="px-6 py-2 text-center">Publish Date</th>
              <th className="px-6 py-2 text-center">Available</th>
              <th className="px-6 py-2 text-center">On Hand</th>
            </tr>
          </thead>
          <tbody className="space-y-4 pt-4">
            {items.map((item) => (
              <tr
                key={item._id}
                className="bg-white hover:bg-gray-50 transition-colors group"
                style={{
                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <td className="px-6 py-4 rounded-l-2xl border-y border-l">
                  <Avatar className="h-10 w-10 border border-gray-100 shadow-sm">
                    <AvatarImage src={getImageUrl(item.image)} />
                    <AvatarFallback className="bg-emerald-50 text-emerald-600 font-bold text-xs">
                      {item.title.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-6 py-4 text-gray-700 font-semibold border-y">
                  {item._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-6 py-4 text-center text-gray-500 font-medium border-y">
                  No SKU
                </td>
                <td className="px-6 py-2 text-center text-gray-500 font-medium border-y">
                  {format(new Date(item.createdAt), "MM-dd-yyyy")}
                </td>
                <td className="px-6 py-4 text-center text-emerald-600 font-bold border-y">
                  {item.availableQuantity}
                </td>
                <td className="px-6 py-4 text-center text-gray-500 font-medium rounded-r-2xl border-y border-r">
                  {item.availableQuantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
