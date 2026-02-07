"use client";

import { Button } from "@/components/ui/button";

interface InventoryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onDownloadCSV: () => void;
  onDownloadPDF: () => void;
}

export default function InventoryHeader({
  search,
  onSearchChange,
  onDownloadCSV,
  onDownloadPDF,
}: InventoryHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
          Inventory Page
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          See the full details of inventory.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto"></div>
    </div>
  );
}
