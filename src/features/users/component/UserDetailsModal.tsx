"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { User } from "../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserDetailsModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-none shadow-2xl rounded-3xl p-0 overflow-hidden bg-white max-h-[90vh] flex flex-col">
        <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500 shrink-0" />

        <div className="px-8 pb-8 -mt-12 overflow-y-auto flex-1">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl font-bold">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="mt-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="capitalize text-xs font-semibold text-emerald-600 border-emerald-200 bg-emerald-50"
                >
                  {user.role}
                </Badge>
                <Badge
                  className={`${
                    user.status === "active"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-red-100 text-red-700 hover:bg-red-200"
                  } border-none font-semibold capitalize text-xs shadow-none`}
                >
                  {user.status || "Active"}
                </Badge>
              </div>
              <p className="text-gray-400 text-xs font-mono mt-1">
                ID: #{user._id.slice(0, 6)}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Contact Information
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Email Address"
                  value={user.email}
                  className="md:col-span-2"
                />
                <DetailItem label="Phone Number" value={user.phoneNumber} />
                <DetailItem
                  label="Home Address"
                  value={user.homeAddress}
                  className="md:col-span-2"
                />
                <DetailItem label="City" value={user.city} />
                <DetailItem label="State / Region" value={user.region} />
              </div>
            </div>

            {/* Employment Details */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Employment Details
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Job / Role" value={user.categoryName} />
                <DetailItem label="Regional Office" value={user.location} />
                <DetailItem
                  label="Current Balance"
                  value={
                    user.balance !== undefined
                      ? `$${user.balance.toFixed(2)}`
                      : undefined
                  }
                  valueClassName="text-emerald-600 font-bold"
                />
                <DetailItem
                  label="Joined Date"
                  value={
                    user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface DetailItemProps {
  label: string;
  value?: string | number | null;
  className?: string;
  valueClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  className,
  valueClassName,
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <span className="text-xs font-medium text-gray-500 uppercase">{label}</span>
    <span
      className={`text-sm font-medium text-gray-900 break-words ${valueClassName}`}
    >
      {value || "Not provided"}
    </span>
  </div>
);

export default UserDetailsModal;
