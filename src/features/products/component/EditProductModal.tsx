"use client";

import { useState, useEffect } from "react";
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
import { Product } from "../types";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useEditProduct } from "../hooks/useProducts";
import { useCategories } from "../../category/hooks/useCategory";
import { toast } from "sonner";
import Image from "next/image";
import { getProductMainImage } from "@/lib/utils";

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

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  sku: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Product type is required"),
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  availableQuantity: z.coerce.number().min(0, "Stock must be at least 0"),
  status: z.enum(["active", "inactive"]),
  role: z.string().min(1, "Category is required"),
  region: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
}: Readonly<EditProductModalProps>) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const { data: categoryData, isLoading: isCategoriesLoading } =
    useCategories();
  const { mutate: editProduct, isPending } = useEditProduct();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const currentStatus = watch("status");

  useEffect(() => {
    if (product && isOpen) {
      reset({
        title: product.title,
        sku: product.sku || "",
        description: product.description,
        type: product.type,
        size: product.size,
        price: product.price,
        availableQuantity: product.availableQuantity,
        status: product.status,
        role: product.role || "",
        region: product.region || "",
      });

      // Handle initial images
      const initialImages: string[] = [];
      if (product.images && Array.isArray(product.images)) {
        product.images.forEach((img) => {
          if (typeof img === "string") {
            initialImages.push(img);
          } else if (img && img.url) {
            initialImages.push(img.url);
          }
        });
      } else if (product.image) {
        initialImages.push(getProductMainImage(product.image));
      }

      setPreviews(Array.from(new Set(initialImages)));
      setImageFiles([]);
    }
  }, [product, isOpen, reset]);

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
      // Note: This logic assumes a 1:1 mapping between previews and imageFiles for new uploads
      // In a more complex scenario with existing images, we'd need a more robust tracking
      updated.splice(index, 1);
      return updated;
    });
  };

  const onSubmit = (values: ProductFormValues) => {
    if (!product) return;

    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("type", values.type);
    formData.append("description", values.description);
    formData.append("size", values.size);
    formData.append("availableQuantity", values.availableQuantity.toString());
    formData.append("price", values.price.toString());
    formData.append("status", values.status);
    formData.append("role", values.role);
    if (values.region) {
      formData.append("rigion", values.region);
    }

    // Append new images
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("image", file);
      });
    }

    editProduct(
      { id: product._id, data: formData },
      {
        onSuccess: () => {
          toast.success("Product updated successfully");
          onClose();
        },
        onError: (error: unknown) => {
          let errorMessage = "Failed to update product";
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
      <DialogContent className="max-w-4xl bg-white rounded-2xl p-0 border-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="bg-[#22AD5C] p-6 text-white shrink-0">
          <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
          <p className="text-green-50 opacity-90 mt-1">
            Update product details and inventory
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
                placeholder="Enter SKU"
                className="rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 font-semibold">
                Job / Role *
              </Label>
              <Select
                value={watch("role")}
                onValueChange={(val) => {
                  setValue("role", val);
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
                      isCategoriesLoading ? "Loading..." : "Select Category"
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

            <div className="space-y-2">
              <Label htmlFor="region" className="text-gray-700 font-semibold">
                Regional Office *
              </Label>
              <Select
                value={watch("region")}
                onValueChange={(val) => setValue("region", val)}
              >
                <SelectTrigger className="rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C]">
                  <SelectValue placeholder="Select Regional Office" />
                </SelectTrigger>
                <SelectContent className="cursor-pointer">
                  {regionalOffice.map((office) => (
                    <SelectItem
                      key={office}
                      value={office}
                      className="border border-gray-200 my-1 cursor-pointer"
                    >
                      {office}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {previews.map((src, index) => (
                <div
                  key={index}
                  className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm"
                >
                  <Image
                    src={src}
                    alt={`Preview ${index}`}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
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
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
