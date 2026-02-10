"use client";

import { useRouter } from "next/navigation";
import { regionalOffice } from "../constants";

export default function InventoryLanding() {
  const router = useRouter();

  const handleRegionClick = (office: string) => {
    router.push(
      `/dashboard/inventory/region?name=${encodeURIComponent(office)}`,
    );
  };

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#FAFAFA] min-h-full rounded-2xl">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Regions</h1>
        <p className="text-gray-500">
          Select a regional office to view inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionalOffice.map((office) => (
          <button
            key={office}
            onClick={() => handleRegionClick(office)}
            className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#22AD5C] transition-all text-left group"
          >
            <h3 className="font-semibold text-gray-800 group-hover:text-[#22AD5C] transition-colors">
              {office}
            </h3>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span>View Inventory</span>
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
