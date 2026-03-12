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
  Package,
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
      <DialogContent className="max-w-4xl bg-white rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
            {/* Product Details */}
            <InfoSection title="Product Details" icon={Package}>
              <div className="space-y-4">
                {order.products?.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border shrink-0">
                      <img
                        src={item.productId.images[0]?.url}
                        alt={item.productId.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4">
                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                          Product Name
                        </span>
                        <span className="text-sm font-bold text-gray-800 line-clamp-1">
                          {item.productId.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                          Quantity
                        </span>
                        <span className="text-sm font-bold text-gray-700">
                          {item.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                          Size
                        </span>
                        <Badge variant="outline" className="text-[10px] font-bold h-5">
                          {item.size}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                          Price
                        </span>
                        <span className="text-sm font-bold text-[#22AD5C]">
                          ${item.productId.price}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                          Region
                        </span>
                        <span className="text-sm font-semibold text-gray-600">
                          {item.productId.rigion?.[0] || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </InfoSection>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
