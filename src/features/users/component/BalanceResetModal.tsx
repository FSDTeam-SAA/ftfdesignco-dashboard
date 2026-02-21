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
import { useUpdateUserBalance } from "../hooks/useUsers";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const balanceResetSchema = z.object({
  balance: z.coerce.number().min(0, "Balance must be at least 0"),
});

type BalanceResetFormValues = z.infer<typeof balanceResetSchema>;

interface BalanceResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BalanceResetModal: React.FC<BalanceResetModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { mutateAsync: updateBalance, isPending } = useUpdateUserBalance();

  const form = useForm<BalanceResetFormValues>({
    resolver: zodResolver(balanceResetSchema),
    defaultValues: {
      balance: 0,
    },
  });

  const onSubmit = async (data: BalanceResetFormValues) => {
    try {
      const response = await updateBalance(data);
      if (response.success) {
        toast.success(response.message || "Balance updated successfully");
        form.reset();
        onClose();
      } else {
        toast.error(response.message || "Failed to update balance");
      }
    } catch (error) {
      console.error("Balance reset error:", error);
      toast.error("An error occurred while updating balance");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-none shadow-2xl rounded-3xl p-0 bg-white overflow-hidden">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Balance Reset
          </DialogTitle>
          <p className="text-gray-500 font-medium mt-1">
            Enter the new balance to apply to users.
          </p>
        </DialogHeader>

        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-bold">
                      New Balance
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        className="rounded-xl border-gray-200 h-12 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                  className="flex-1 h-12 rounded-xl border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 border-none"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Balance"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BalanceResetModal;
