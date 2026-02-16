"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CSVImportResponse } from "../types";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface CSVImportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CSVImportResponse | null;
}

const CSVImportSummaryModal: React.FC<CSVImportSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!data) return null;

  const summary = data.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] border-none shadow-2xl rounded-4xl p-0 bg-white overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="text-emerald-500 h-6 w-6" />
            <DialogTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
              CSV Upload Summary
            </DialogTitle>
          </div>
          <p className="text-gray-500 font-medium">
            Processed Successfully - Here is the breakdown of your import
            results.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
              <p className="text-gray-500 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                Total Records
              </p>
              <p className="text-3xl font-black text-gray-900 leading-none">
                {summary?.total ?? 0}
              </p>
            </div>
            <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 flex flex-col items-center justify-center text-center">
              <p className="text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                Successfully Added
              </p>
              <p className="text-3xl font-black text-emerald-700 leading-none">
                {summary?.success ?? 0}
              </p>
            </div>
            <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 flex flex-col items-center justify-center text-center">
              <p className="text-rose-600 text-[10px] font-extrabold uppercase tracking-widest mb-2">
                Failed Records
              </p>
              <p className="text-3xl font-black text-rose-700 leading-none">
                {summary?.failed ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
            <p className="text-gray-500 font-medium">
              If a password is not provided while creating or fetching a user,
              the system will automatically assign a default password: 123456
            </p>
          </div>
        </div>

        <div className="p-8 pt-0 mt-auto">
          <Button
            onClick={onClose}
            className="w-full h-14 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] font-bold text-white shadow-lg transition-all hover:translate-x-0.5 border-none flex items-center justify-center gap-2"
          >
            Close
            <ChevronRight size={20} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVImportSummaryModal;
