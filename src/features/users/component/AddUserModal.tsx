"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/features/category/hooks/useCategory";
import { Loader2 } from "lucide-react";
import { useAddUser } from "../hooks/useUsers";
import { toast } from "sonner";

const addUserSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters"),
  homeAddress: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  region: z.string().min(2, "Region is required"),
  categoryName: z.string().min(1, "Job / Role is required"),
  // companyName: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  balance: z.coerce.number().min(0, "Balance must be at least 0"),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesData?.data || [];

  const { mutateAsync: addUser, isPending: isAddingUser } =
    useAddUser();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      homeAddress: "",
      city: "",
      region: "",
      categoryName: "",
      // companyName: "",
      location: "",
      balance: 0,
    },
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
  ];

  // Add User Submit Handler
  const onSubmit = (data: AddUserFormValues) => {
    console.log("Adding New User with Category:", data);
    addUser(data);
    if (isAddingUser) {
      toast.loading("Adding user...");
    }
    if (isAddingUser) {
      toast.success("User added successfully");
    }
    if (isAddingUser) {
      toast.error("Failed to add user");
    }
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] border-none shadow-2xl rounded-3xl p-0 bg-white overflow-hidden flex flex-col">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Add New User
          </DialogTitle>
          <p className="text-gray-500 font-medium mt-1">
            Fill in the details to create a new user account.
          </p>
        </DialogHeader>

        <div className="px-8 pb-8 pt-6 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Last Name"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567890"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        Job / Role
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingCategories}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                            <SelectValue
                              placeholder={
                                isLoadingCategories
                                  ? "Loading Job/Role..."
                                  : "Select a Job/Role"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-gray-100">
                          {isLoadingCategories ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                            </div>
                          ) : categories.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                              No Job/Role found
                            </div>
                          ) : (
                            categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category.roleTitle}
                              >
                                {category.roleTitle}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-bold">
                      Home Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St"
                        {...field}
                        className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        City
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="New York"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        State
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NY"
                          {...field}
                          className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-bold">
                        REGIONAL OFFICE
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all">
                            <SelectValue placeholder="Select Regional Office" />
                          </SelectTrigger>
                          <SelectContent className="cursor-pointer">
                            {regionalOffice.map((office) => (
                              <SelectItem key={office} value={office} className="border border-gray-200 my-1 cursor-pointer">
                                {office}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-bold">
                      Balance
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="150"
                        {...field}
                        className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-14 rounded-2xl border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 border-none"
                >
                  Add User
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal;
