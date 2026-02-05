"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Order } from "../types";
import {
  User,
  MapPin,
  CreditCard,
  ClipboardList,
  LucideIcon,
} from "lucide-react";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoSection = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-[#22AD5C] font-semibold border-b pb-2">
      <Icon size={18} />
      <h3>{title}</h3>
    </div>
    <div className="grid grid-cols-1 gap-4 pt-1">{children}</div>
  </div>
);

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
      {label}
    </span>
    <span className="text-md font-semibold text-gray-700">
      {value || "N/A"}
    </span>
  </div>
);

export default function OrderDetailsModal({
  order,
  isOpen,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
        <DialogHeader className="bg-[#22AD5C] p-6 text-white text-left">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>Order Details</span>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1"
            >
              {order.status.toUpperCase()}
            </Badge>
          </DialogTitle>
          <p className="text-green-50 opacity-90 mt-1">
            Order ID: #{order._id.slice(-4)}
          </p>
        </DialogHeader>

        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Customer Info */}
            <InfoSection title="Customer Information" icon={User}>
              <InfoItem
                label="Full Name"
                value={
                  order.user
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : "Guest Dealer"
                }
              />
              <InfoItem label="Email Address" value={order.user?.email} />
              <InfoItem label="Phone Number" value={order.user?.phoneNumber} />
            </InfoSection>

            {/* Order Info */}
            <InfoSection title="Order Information" icon={ClipboardList}>
              <InfoItem
                label="Created At"
                value={order.createdAt ? formatDate(order.createdAt) : "N/A"}
              />
              <InfoItem label="Region / Location" value={order.region} />
              <InfoItem
                label="Status"
                value={
                  order.status.charAt(0).toUpperCase() + order.status.slice(1)
                }
              />
            </InfoSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Financial Info */}
            <InfoSection title="Financial Details" icon={CreditCard}>
              <InfoItem
                label="Total Amount"
                value={`$${order.totalAmount.toLocaleString()}`}
              />
              <InfoItem
                label="Remaining Balance"
                value={`$${order.remainingBalance.toLocaleString()}`}
              />
            </InfoSection>

            {/* Other details if any */}
            <InfoSection title="Additional Details" icon={MapPin}>
              <InfoItem label="Currency" value="USD" />
            </InfoSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
