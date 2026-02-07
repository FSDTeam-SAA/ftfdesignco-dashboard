"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileUp, Loader2, X } from "lucide-react";
import { useAddMultipleUsers } from "../hooks/useUsers";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import CSVImportSummaryModal from "./CSVImportSummaryModal";
import { CSVImportResponse } from "../types";

interface ImportUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportUsersModal: React.FC<ImportUsersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [summaryData, setSummaryData] = useState<CSVImportResponse | null>(
    null,
  );
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: addMultipleUsers, isPending } = useAddMultipleUsers();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast.error("Please select a valid CSV file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await addMultipleUsers(formData);
      if (response.success) {
        toast.success(response.message || "Users imported successfully");
        setSummaryData(response);
        setIsSummaryOpen(true);
        setFile(null);
      } else {
        toast.error(response.message || "Failed to import users");
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong while importing users";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] border-none shadow-2xl rounded-4xl p-8 bg-white overflow-hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Import users by CSV
          </DialogTitle>
          <p className="text-gray-500 font-medium mt-1">
            Download the template and upload your filled CSV file to import
            users.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-4xl p-12 flex flex-col items-center justify-center transition-all ${
              file
                ? "border-emerald-500 bg-emerald-50/30"
                : "border-gray-200 bg-gray-50/50"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <FileUp className="text-emerald-600 h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="text-gray-900 font-bold text-lg mb-1 truncate max-w-[300px]">
                    {file.name}
                  </p>
                  <p className="text-gray-400 text-sm font-medium">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 mb-6 flex items-center justify-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.3333 42.6667V42.6667C15.4423 42.6667 10.6667 37.891 10.6667 32C10.6667 26.6575 14.6186 22.2343 19.7892 21.4391C21.0504 15.2289 26.5053 10.6667 33.0667 10.6667C39.6974 10.6667 45.2045 15.3341 46.3888 21.6443C50.6015 22.8687 53.3333 26.7909 53.3333 31.3333C53.3333 37.5925 48.2592 42.6667 42 42.6667V42.6667"
                      stroke="#94A3B8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M32 32V53.3333M32 32L24 40M32 32L40 40"
                      stroke="#94A3B8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-11 px-8 rounded-xl border-gray-200 font-bold text-gray-700 hover:bg-white hover:shadow-sm transition-all mb-3 bg-white"
                >
                  Add File
                </Button>
                <p className="text-gray-400 font-medium text-sm">
                  or drop file to{" "}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-600 underline cursor-pointer"
                  >
                    upload
                  </button>
                </p>
              </>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 h-14 rounded-2xl border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all border-none"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={!file || isPending}
              className="flex-1 h-14 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 border-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload & Continue"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>

      <CSVImportSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          onClose(); // Close both modals
        }}
        data={summaryData}
      />
    </Dialog>
  );
};

export default ImportUsersModal;
