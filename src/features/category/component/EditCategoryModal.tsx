"use client";
import React, { useState } from "react";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateCategory } from "../hooks/useCategory";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";
import Image from "next/image";
import { Category as CategoryType } from "../types";

const formSchema = z.object({
    roleTitle: z.string().min(2, "Job/Role must be at least 2 characters"),
    image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: CategoryType | null;
}

export default function EditCategoryModal({
    isOpen,
    onClose,
    category,
}: Readonly<EditCategoryModalProps>) {
    const [preview, setPreview] = useState<string | null>(category?.images || null);
    const { mutateAsync: updateCategory, isPending } = useUpdateCategory();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roleTitle: category?.roleTitle || "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file, { shouldValidate: true });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (values: FormValues) => {
        if (!category?._id) return;

        try {
            const formData = new FormData();
            formData.append("roleTitle", values.roleTitle);
            if (values.image) {
                formData.append("images", values.image as Blob);
            }

            const response = await updateCategory({ id: category._id, formData });
            if (response.success) {
                toast.success(response.message || "Job / Role updated successfully");
                onClose();
            } else {
                toast.error(response.message || "Failed to update Job / Role");
            }
        } catch (error: unknown) {


            let errorMessage = "Something went wrong";
            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Job / Role</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="roleTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job / Role</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Job / Role" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Job / Role Image</FormLabel>
                            <div className="flex flex-col items-center justify-center gap-4">
                                {preview ? (
                                    <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            fill
                                            className="object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreview(null);
                                                form.setValue("image", undefined);
                                            }}
                                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                                        <Upload
                                            size={32}
                                            className="text-gray-400 group-hover:text-emerald-500 mb-2"
                                        />
                                        <span className="text-sm text-gray-500 group-hover:text-emerald-600 font-medium">
                                            Click to upload image
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                                <FormMessage>
                                    {form.formState.errors.image?.message as string}
                                </FormMessage>
                            </div>
                        </FormItem>

                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#065F46] font-semibold"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Job / Role"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
