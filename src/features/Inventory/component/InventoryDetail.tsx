"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInventory } from "../hooks/useInventory";
import InventoryHeader from "./InventoryHeader";
import InventoryTable from "./InventoryTable";
import { InventoryResponse } from "../types";
import { downloadInventoryCSV, downloadInventoryPDF } from "../api/Inventory";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";

export default function InventoryDetail() {
  const searchParams = useSearchParams();
  const regionName = searchParams.get("name") || "";
  const [search, setSearch] = useState("");
  const router = useRouter();

  const { data, isLoading, error } = useInventory(regionName);
  const inventoryResponse = data as InventoryResponse;

  const items = inventoryResponse?.data || [];

  const handleDownloadCSV = async () => {
    try {
      const blob = await downloadInventoryCSV(search);
      downloadFile(blob, "inventory_list.csv");
      toast.success("Inventory CSV downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download CSV");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const blob = await downloadInventoryPDF(search);
      downloadFile(blob, "inventory_list.pdf");
      toast.success("Inventory PDF downloaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF");
    }
  };

  if (!regionName) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No region selected.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-[#FAFAFA] min-h-screen rounded-2xl">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-500 mb-4">
          !
        </div>
        <h3 className="text-lg font-bold text-gray-900">
          Error loading inventory
        </h3>
        <p className="text-gray-500 max-w-sm mx-auto mt-1">
          Please check your connection and try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#FAFAFA] min-h-full rounded-2xl">
      <div className="flex justify-start">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 cursor-pointer hover:text-gray-600 transition-all duration-300 ease-in-out"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Regional Office
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{regionName}</h1>
      </div>

      <InventoryHeader
        search={search}
        onSearchChange={(val) => setSearch(val)}
        onDownloadCSV={handleDownloadCSV}
        onDownloadPDF={handleDownloadPDF}
      />

      <InventoryTable items={items} isLoading={isLoading} />

      {!isLoading && items.length === 0 && (
        <div className="bg-white p-20 rounded-4xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 font-medium text-lg">
            No inventory items found for this region.
          </p>
        </div>
      )}
    </div>
  );
}
