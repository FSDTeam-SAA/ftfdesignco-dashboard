import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationMetadata } from "../types";

interface PaginationProps {
  pagination: PaginationMetadata;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { total, page, limit, totalPages } = pagination;

  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-10">
      <div className="text-sm text-gray-500 font-medium order-2 sm:order-1">
        Showing{" "}
        <span className="text-gray-900 font-bold">
          {total > 0 ? startIdx : 0}
        </span>{" "}
        to <span className="text-gray-900 font-bold">{endIdx}</span> of{" "}
        <span className="text-gray-900 font-bold">{total}</span> products
      </div>

      <div className="flex flex-wrap items-center gap-2 order-1 sm:order-2">
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm text-gray-500 font-medium">
            Rows per page:
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => onLimitChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] h-9 border-gray-200 rounded-lg">
              <SelectValue placeholder={limit.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-all hidden sm:flex"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            <ChevronsLeft size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-all shadow-sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={18} />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              // Show current, first, last, and pages around current
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= page - 1 && pageNum <= page + 1)
              ) {
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    className={`h-9 w-9 flex items-center justify-center rounded-full font-semibold transition-all border-none ${
                      page === pageNum
                        ? "bg-[#22AD5C] text-white shadow-md shadow-green-200 hover:bg-[#1a8a49]"
                        : "text-gray-600 hover:bg-gray-50 bg-transparent border border-gray-200"
                    }`}
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              }
              // Show ellipsis
              if (pageNum === page - 2 || pageNum === page + 2) {
                return (
                  <span key={pageNum} className="text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-green-500 text-green-500 rounded-full hover:bg-green-50 transition-all shadow-sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-gray-200 rounded-full hover:bg-gray-50 text-gray-600 transition-all hidden sm:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronsRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
