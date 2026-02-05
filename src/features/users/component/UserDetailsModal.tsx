"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl p-0 overflow-hidden bg-white">
        <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-500" />
        <div className="px-8 pb-8 -mt-12">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl font-bold">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-500">Role</span>
              <Badge
                variant="outline"
                className="capitalize font-semibold text-emerald-600 border-emerald-100 bg-emerald-50"
              >
                {user.role}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-500">Status</span>
              <Badge
                className={`${
                  user.status === "active"
                    ? "bg-[#D1FAE5] text-[#10B981]"
                    : "bg-[#FEE2E2] text-[#EF4444]"
                } border-none font-semibold capitalize`}
              >
                {user.status || "Active"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-50">
              <span className="text-gray-500">User ID</span>
              <span className="font-mono text-gray-400 text-xs">
                #{user._id.slice(-4)}
              </span>
            </div>
            {user.createdAt && (
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">Joined</span>
                <span className="text-gray-900 font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
