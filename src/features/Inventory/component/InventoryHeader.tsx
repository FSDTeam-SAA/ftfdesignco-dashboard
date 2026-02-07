"use client";
 
import { Button } from "@/components/ui/button";
 
interface InventoryHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function InventoryHeader({
//   search,
//   onSearchChange,
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

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full px-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-gray-700 h-11"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="bg-white border-gray-200 text-gray-700 font-semibold rounded-xl h-12 px-4 flex items-center gap-2 hover:bg-gray-50"
            >
              Office Location
              <ChevronDown size={18} className="text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-xl border-gray-100 shadow-xl">
            <DropdownMenuItem className="rounded-lg">
              Main Office
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg">
              Warehouse A
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg">
              Retail Store
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}

        <div className="flex items-center gap-3 ml-auto md:ml-0">
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 font-semibold rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-gray-50 shadow-sm"
          >
            Export
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 font-semibold rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-gray-50 shadow-sm"
          >
            CSV
          </Button>
          <Button
            variant="outline"
            className="bg-white border-gray-200 text-gray-700 font-semibold rounded-xl h-12 px-6 flex items-center gap-2 hover:bg-gray-50 shadow-sm"
          >
            Pdf
          </Button>
        </div>
      </div>
    </div>
  );
}
