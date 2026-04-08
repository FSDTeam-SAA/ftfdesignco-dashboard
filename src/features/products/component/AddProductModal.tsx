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
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { useAddProduct } from "../hooks/useProducts";
import { useCategories } from "../../category/hooks/useCategory";
import { toast } from "sonner";
import Image from "next/image";

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Product type is required"),
  size: z.string().min(1, "Size is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  availableQuantity: z.coerce.number().min(0, "Stock must be at least 0"),
  fit_cut: z.string().min(1, "Fit/Cut is required"),
  fabric_material: z.string().min(1, "Fabric/Material is required"),
  // status: z.enum(["active", "inactive"]),
  role: z.string().optional(),
  targetRoles: z
    .array(z.string())
    .min(1, "At least one target role is required"),
  regionalOffices: z
    .array(z.string())
    .min(1, "At least one regional office is required"),
});

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
  "24181 State Hwy 49 Unit C, Richfield, NC 28137",
];

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
      // status: "active",
      price: 0,
      availableQuantity: 0,
      regionalOffices: [],
    },
  });

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
    formData.append("fit_cut", values.fit_cut);
    formData.append("fabric_material", values.fabric_material);
    formData.append("availableQuantity", values.availableQuantity.toString());
    formData.append("price", values.price.toString());
    formData.append("status", "active");
    formData.append("role", values.targetRoles[0]); // Fallback for legacy 'role' field

    // Append targetRoles[]
    values.targetRoles.forEach((roleId) => {
      formData.append("targetRoles[]", roleId);
    });

    // Append rigion[]
    values.regionalOffices.forEach((office) => {
      formData.append("rigion", office);
    });

    // Append image(s) - The Postman shows 'image' as a File
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
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
              <Label htmlFor="role" className="text-gray-700 font-semibold">
                Job / Role *
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                {isCategoriesLoading ? (
                  <div className="col-span-full flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                  </div>
                ) : (
                  categoryData?.data.map((category) => {
                    const selectedRoles = watch("targetRoles") || [];
                    const isChecked = selectedRoles.includes(category._id);

                    return (
                      <div
                        key={category._id}
                        onClick={() => {
                          const current = watch("targetRoles") || [];
                          if (!isChecked) {
                            setValue("targetRoles", [...current, category._id]);
                          } else {
                            setValue(
                              "targetRoles",
                              current.filter((id) => id !== category._id),
                            );
                          }

                          // Keep 'type' updated for create product compatibility if needed
                          if (!isChecked && current.length === 0) {
                            setValue("type", category.roleTitle);
                          }
                        }}
                        className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer select-none h-24 text-center ${
                          isChecked
                            ? "bg-emerald-50 border-emerald-500 shadow-sm"
                            : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center absolute top-2 right-2 transition-all ${
                            isChecked
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div
                          className={`p-2 rounded-lg mb-1 transition-colors ${isChecked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-500"}`}
                        >
                          <ImageIcon size={18} />
                        </div>
                        <span
                          className={`text-xs font-bold leading-tight line-clamp-2 ${isChecked ? "text-emerald-700" : "text-gray-600"}`}
                        >
                          {category.roleTitle}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              {errors.targetRoles && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.targetRoles.message}
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
              <Label htmlFor="fit_cut" className="text-gray-700 font-semibold">
                Fit/Cut *
              </Label>
              <Input
                id="fit_cut"
                {...register("fit_cut")}
                placeholder="e.g. Regular Fit, Slim Fit"
                className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                  errors.fit_cut ? "border-red-500" : ""
                }`}
              />
              {errors.fit_cut && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fit_cut.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="fabric_material"
                className="text-gray-700 font-semibold"
              >
                Fabric/Material *
              </Label>
              <Input
                id="fabric_material"
                {...register("fabric_material")}
                placeholder="e.g. Cotton, Polyester"
                className={`rounded-lg border-gray-200 focus:border-[#22AD5C] focus:ring-[#22AD5C] ${
                  errors.fabric_material ? "border-red-500" : ""
                }`}
              />
              {errors.fabric_material && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fabric_material.message}
                </p>
              )}
            </div>

            {/* <div className="space-y-2">
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
            </div> */}

            <div className="space-y-2 md:col-span-2">
              <Label
                htmlFor="regionalOffices"
                className="text-gray-700 font-semibold"
              >
                Regional Office *
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border border-gray-100 rounded-2xl bg-gray-50/50">
                {regionalOffice.map((office) => {
                  const selectedOffices = watch("regionalOffices") || [];
                  const isChecked = selectedOffices.includes(office);

                  return (
                    <div
                      key={office}
                      onClick={() => {
                        const current = watch("regionalOffices") || [];
                        if (!isChecked) {
                          setValue("regionalOffices", [...current, office]);
                        } else {
                          setValue(
                            "regionalOffices",
                            current.filter((o) => o !== office),
                          );
                        }
                      }}
                      className={`group relative flex items-center p-3 rounded-xl border-2 transition-all cursor-pointer select-none h-auto gap-3 ${
                        isChecked
                          ? "bg-emerald-50 border-emerald-500 shadow-sm"
                          : "bg-white border-transparent hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                          isChecked
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold leading-tight ${isChecked ? "text-emerald-700" : "text-gray-600"}`}
                      >
                        {office}
                      </span>
                    </div>
                  );
                })}
              </div>
              {errors.regionalOffices && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.regionalOffices.message}
                </p>
              )}
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
