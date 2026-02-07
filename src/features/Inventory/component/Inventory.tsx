"use client";

import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import InventoryHeader from "./InventoryHeader";
import InventoryTable from "./InventoryTable";
import Pagination from "@/components/shared/Pagination";
import { InventoryResponse } from "../types";
import { downloadInventoryCSV, downloadInventoryPDF } from "../api/Inventory";
import { downloadFile } from "@/lib/utils";
import { toast } from "sonner";

export default function Inventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useInventory(
    currentPage,
    itemsPerPage,
    search,
  );
  const inventoryResponse = data as InventoryResponse;

  const items = inventoryResponse?.data || [];
  const paginationData = inventoryResponse?.meta
    ? {
        total: inventoryResponse.meta.total,
        page: inventoryResponse.meta.page,
        limit: inventoryResponse.meta.limit,
        totalPages: inventoryResponse.meta.totalPage,
      }
    : {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

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
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onDownloadCSV={handleDownloadCSV}
        onDownloadPDF={handleDownloadPDF}
      />

      <InventoryTable items={items} isLoading={isLoading} />

      {!isLoading && items.length > 0 && (
        <Pagination
          pagination={paginationData}
          onPageChange={setCurrentPage}
          onLimitChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
          itemName="inventory items"
        />
      )}

      {!isLoading && items.length === 0 && (
        <div className="bg-white p-20 rounded-4xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-400 font-medium text-lg">
            No inventory items found.
          </p>
        </div>
      )}
    </div>
  );
}
