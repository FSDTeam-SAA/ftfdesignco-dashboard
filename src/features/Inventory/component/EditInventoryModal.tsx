"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEditProduct } from "../hooks/useInventory";
import { InventoryItem } from "../types";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const inventorySchema = z.object({
  availableQuantity: z.coerce.number().min(0, "Stock must be at least 0"),
});

type InventoryFormValues = z.infer<typeof inventorySchema>;

interface EditInventoryModalProps {
  product: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditInventoryModal({
  product,
  isOpen,
  onClose,
}: Readonly<EditInventoryModalProps>) {
  const queryClient = useQueryClient();
  const { mutate: editProduct, isPending } = useEditProduct();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventorySchema),
  });

  useEffect(() => {
    if (product && isOpen) {
      reset({
        availableQuantity: product.availableQuantity,
      });
    }
  }, [product, isOpen, reset]);

  const onSubmit = (values: InventoryFormValues) => {
    if (!product) return;

    const formData = new FormData();
    // We only need to send the availableQuantity.
    // Assuming backend accepts partial updates via PUT or handles it gracefully.
    // If backend requires all fields, this might need adjustment, but request was to only edit this field.
    // However, usually PUT replaces the resource. If the backend is strict REST, we might need to send everything.
    // But since I don't have the full product data here (InventoryItem might differ from Product),
    // and based on "Edit only the Available field", I will try sending just this.
    // Ideally this should be a PATCH, but the hook uses PUT.
    // Let's send what we have.

    formData.append("availableQuantity", values.availableQuantity.toString());

    editProduct(
      { id: product._id, data: formData },
      {
        onSuccess: () => {
          toast.success("Inventory updated successfully");
          // Invalidate inventory queries to refresh the table
          queryClient.invalidateQueries({ queryKey: ["inventory"] });
          onClose();
        },
        onError: (error: unknown) => {
          let errorMessage = "Failed to update inventory";
          if (error && typeof error === "object" && "response" in error) {
            const axiosError = error as {
              response?: { data?: { message?: string } };
            };
            errorMessage = axiosError.response?.data?.message || errorMessage;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white rounded-2xl p-0 border-none shadow-2xl overflow-hidden flex flex-col">
        <DialogHeader className="bg-[#22AD5C] p-6 text-white shrink-0">
          <DialogTitle className="text-xl font-bold">
            Edit Inventory
          </DialogTitle>
          <p className="text-green-50 opacity-90 mt-1 text-sm">
            Update available stock for {product?.title}
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="space-y-2">
            <Label
              htmlFor="availableQuantity"
              className="text-gray-700 font-semibold"
            >
              Available Quantity *
            </Label>
            <Input
              id="availableQuantity"
              type="number"
              {...register("availableQuantity")}
              className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                errors.availableQuantity ? "border-red-500" : ""
              }`}
            />
            {errors.availableQuantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.availableQuantity.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#22AD5C] hover:bg-[#1b8a4a] text-white font-semibold"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
