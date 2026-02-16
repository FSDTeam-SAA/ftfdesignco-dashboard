"use client";

import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import InventoryHeader from "./InventoryHeader";
import InventoryTable from "./InventoryTable";
import { InventoryResponse } from "../types";
import { downloadInventoryCSV, downloadInventoryPDF } from "../api/Inventory";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

// REGIONAL OFFICE Name
const regionalOffice = [
  "21 Industrial Blvd. New Castle, DE 19720",
  "6380 Flank Dr. #600 Harrisburg, PA 17112",
  "141 Delta Dr. Suite D Pittsburgh, PA 15238",
  "1000 Prime Place. Hauppauge, NY 11788",
  "2 Cranberry Rd. #A5 Parsippany, NJ 07054",
  "5061 Howerton Way. Suite L Bowie, MD 20715",
  "10189 Maple Leaf Ct. Ashland, VA 23005",
  "2551 Eltham Ave. Suite L Norfolk, VA 23513",
];

export default function Inventory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region");

  const selectedRegion =
    regionalOffice.find((office) => office === regionParam) ||
    regionalOffice[0];
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useInventory(selectedRegion);
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

  const handleRegionChange = (office: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", office);
    router.push(`/dashboard/inventory?${params.toString()}`);
  };

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
      <InventoryHeader
        search={search}
        onSearchChange={(val) => setSearch(val)}
        onDownloadCSV={handleDownloadCSV}
        onDownloadPDF={handleDownloadPDF}
      />

      {/* Region Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide cursor-pointer">
        {regionalOffice.map((office) => (
          <button
            key={office}
            onClick={() => handleRegionChange(office)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              selectedRegion === office
                ? "bg-[#22AD5C] text-white shadow-md shadow-green-100 cursor-pointer"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 cursor-pointer"
            }`}
          >
            {office}
          </button>
        ))}
      </div>

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
