"use client";

import { useState } from "react";
import { InventoryItem } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { getProductMainImage } from "@/lib/utils";
import Image from "next/image";
import { Pencil } from "lucide-react";
import EditInventoryModal from "./EditInventoryModal";

interface InventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
}

export default function InventoryTable({
  items,
  isLoading,
}: Readonly<InventoryTableProps>) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-4xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={`inventory-skeleton-${i}`}
              className="h-20 w-full rounded-2xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
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
                <th className="px-6 py-2 text-center">Action</th>
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
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                      <Image
                        src={getProductMainImage(item.images || item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        width={40}
                        height={40}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder-product.png";
                        }}
                      />
                      {(item.images?.length || 0) > 1 && (
                        <div className="absolute bottom-0 right-0 bg-emerald-500 text-white text-[8px] font-bold px-1 rounded-tl-md">
                          +{item.images!.length - 1}
                        </div>
                      )}
                    </div>
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
                  <td className="px-6 py-4 text-center text-gray-500 font-medium border-y">
                    {item.availableQuantity}
                  </td>
                  <td className="px-6 py-4 text-center border-y border-r rounded-r-2xl">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-[#22AD5C] hover:bg-green-50 rounded-full transition-all cursor-pointer"
                      title="Edit Stock"
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditInventoryModal
        product={selectedItem}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
      />
    </>
  );
}
