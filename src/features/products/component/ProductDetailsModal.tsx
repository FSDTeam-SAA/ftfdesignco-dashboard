"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Product } from "../types";
import {
  Tag,
  DollarSign,
  Info,
  Calendar,
  Image as ImageIcon,
  LucideIcon,
} from "lucide-react";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

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
  value: string | number | undefined | null;
}) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm text-gray-400 font-medium uppercase tracking-wider">
      {label}
    </span>
    <span className="text-md font-semibold text-gray-700">
      {value ?? "N/A"}
    </span>
  </div>
);

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
}: ProductDetailsModalProps) {
  if (!product) return null;

  const imageUrl =
    typeof product.image === "string"
      ? product.image
      : product.image?.url || "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-white rounded-2xl overflow-hidden p-0 border-none shadow-2xl">
        <DialogHeader className="bg-[#22AD5C] p-6 text-white text-left">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {product.title}
              </DialogTitle>
              <p className="text-green-50 opacity-90 mt-1">
                Product ID: #{product._id.slice(-4)}
              </p>
            </div>
            <Badge
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30 border-none px-4 py-1.5"
            >
              {product.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Product Info */}
          <div className="space-y-8">
            <InfoSection title="Basic Information" icon={Info}>
              <InfoItem label="Product Name" value={product.title} />
              <InfoItem
                label="SKU"
                value={product.sku || product._id.slice(-8).toUpperCase()}
              />
              <InfoItem label="Category / Type" value={product.type} />
              <InfoItem label="Size" value={product.size} />
            </InfoSection>

            <InfoSection title="Inventory & Pricing" icon={DollarSign}>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="Price" value={`$${product.price}`} />
                <InfoItem
                  label="Stock Quantity"
                  value={product.availableQuantity}
                />
              </div>
            </InfoSection>
          </div>

          {/* Right Column: Descriptions & Media */}
          <div className="space-y-8">
            <InfoSection title="Product Image" icon={ImageIcon}>
              {imageUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-dashed border-gray-200">
                  No Image Available
                </div>
              )}
            </InfoSection>

            <InfoSection title="Description" icon={Tag}>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description ||
                  "No description provided for this product."}
              </p>
            </InfoSection>

            <InfoSection title="Timestamps" icon={Calendar}>
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Created"
                  value={
                    product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoItem
                  label="Updated"
                  value={
                    product.updatedAt
                      ? new Date(product.updatedAt).toLocaleDateString()
                      : "N/A"
                  }
                />
              </div>
            </InfoSection>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
