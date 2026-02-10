"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAddProduct } from "../hooks/useProducts";
import { useCategories } from "../../category/hooks/useCategory";
import { toast } from "sonner";
import Image from "next/image";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  sku: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Product type is required"),
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  availableQuantity: z.coerce.number().min(0, "Stock must be at least 0"),
  status: z.enum(["active", "inactive"]),
  role: z.string().min(1, "Job / Role is required"),
  targetRoles: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
}: Readonly<AddProductModalProps>) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { data: categoryData, isLoading: isCategoriesLoading } =
    useCategories();
  const { mutate: addProduct, isPending } = useAddProduct();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: "active",
      price: 0,
      availableQuantity: 0,
    },
  });

  const currentStatus = watch("status");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed.startsWith("blob:")) {
        URL.revokeObjectURL(removed);
      }
      return updated;
    });
    setImageFiles((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };
  const onSubmit = (values: ProductFormValues) => {
    const formData = new FormData();

    // Append standard fields
    formData.append("title", values.title);
    formData.append("type", values.type);
    formData.append("description", values.description);
    formData.append("size", values.size);
    formData.append("availableQuantity", values.availableQuantity.toString());
    formData.append("price", values.price.toString());
    formData.append("status", values.status);
    formData.append("role", values.role);
    // if (values.targetRoles) {
    //   formData.append("targetRoles", values.targetRoles);
    // }

    // Append image(s) - The Postman shows 'image' as a File
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("image", file);
      });
    }

    addProduct(formData, {
      onSuccess: () => {
        toast.success("Product added successfully");
        reset();
        setPreviews([]);
        setImageFiles([]);
        onClose();
      },
      onError: (error: unknown) => {
        let errorMessage = "Failed to add product";
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
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-white rounded-2xl p-0 border-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="bg-[#22AD5C] p-6 text-white shrink-0">
          <DialogTitle className="text-2xl font-bold">
            Add New Product
          </DialogTitle>
          <p className="text-green-50 opacity-90 mt-1">
            Fill in the details to create a new product
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-8 space-y-8"
        >
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-semibold">
                Product Name *
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter product title"
                className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                  errors.title ? "border-red-500" : ""
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku" className="text-gray-700 font-semibold">
                SKU
              </Label>
              <Input
                id="sku"
                {...register("sku")}
                placeholder="Enter SKU (optional)"
                className="rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 font-semibold">
                Job / Role *
              </Label>
              <Select
                onValueChange={(val) => {
                  setValue("role", val);
                  // Also set 'type' to the category label if needed by backend,
                  // or keep it separate. The Postman shows 'type' as 'Apparel' and 'role' as ID.
                  const selectedCategory = categoryData?.data.find(
                    (c) => c._id === val,
                  );
                  if (selectedCategory) {
                    setValue("type", selectedCategory.roleTitle);
                  }
                }}
              >
                <SelectTrigger
                  className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                    errors.role ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue
                    placeholder={
                      isCategoriesLoading ? "Loading..." : "Select Job/Role"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categoryData?.data.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.roleTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-gray-700 font-semibold">
                Size / Variant *
              </Label>
              <Input
                id="size"
                {...register("size")}
                placeholder="e.g. M, L, XL or 42, 44"
                className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                  errors.size ? "border-red-500" : ""
                }`}
              />
              {errors.size && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.size.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-700 font-semibold">
                Price ($) *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="availableQuantity"
                className="text-gray-700 font-semibold"
              >
                Stock Quantity *
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

            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700 font-semibold">
                Status *
              </Label>
              <Select
                value={currentStatus}
                onValueChange={(val: "active" | "inactive") =>
                  setValue("status", val)
                }
              >
                <SelectTrigger className="rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* <div className="space-y-2">
              <Label
                htmlFor="targetRoles"
                className="text-gray-700 font-semibold"
              >
                Target Roles
              </Label>
              <Input
                id="targetRoles"
                {...register("targetRoles")}
                placeholder="e.g. Retail, Wholesale"
                className="rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C]"
              />
            </div> */}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-gray-700 font-semibold"
            >
              Description *
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              placeholder="Enter product description..."
              className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-gray-700 font-semibold flex items-center gap-2">
              <ImageIcon size={18} className="text-[#22AD5C]" />
              Product Images
            </Label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {previews.map((src) => (
                <div
                  key={src}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
                >
                  <Image
                    src={src}
                    alt="Product preview"
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(previews.indexOf(src))}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#22AD5C] hover:bg-green-50 transition-all text-gray-400 hover:text-[#22AD5C]">
                <Upload size={24} />
                <span className="text-xs font-medium">Upload Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#22AD5C] hover:bg-[#1b8a4a] text-white font-semibold px-8 shadow-md shadow-green-100 min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
