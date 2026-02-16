"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu, Loader2, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import Sidebar from "./Sidebar";
import Image from "next/image";
import { useLogout } from "@/features/auth/hooks/uselogout";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const { setMobileOpen, isMobileOpen } = useSidebarStore();

  const getPageTitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/dashboard/products":
        return "Products Management";
      case "/dashboard/users":
        return "User Accounts";
      case "/dashboard/shipping-info":
        return "Shipping & Logistics";
      case "/dashboard/inventory-page":
        return "Inventory Tracking";
      case "/dashboard/category":
        return "Job/Role Management";
      default:
        return "Dashboard";
    }
  };

  const getPageSubtitle = (path: string) => {
    switch (path) {
      case "/dashboard":
        return "Welcome back! Here's what's happening today.";
      case "/dashboard/products":
        return "Manage your product inventory and listings.";
      case "/dashboard/users":
        return "View and manage user accounts and permissions.";
      case "/dashboard/shipping-info":
        return "Track shipments and manage logistics.";
      case "/dashboard/inventory-page":
        return "Monitor stock levels and warehouse data.";
      case "/dashboard/category":
        return "Manage your product Role/Job.";
      default:
        return "";
    }
  };

  const { loading: isLoggingOut, handleLogout } = useLogout();

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "??";
  };

  return (
    <header className="h-20 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-40 w-full px-4 md:px-6">
      <div className="flex h-full items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SheetHeader className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={28}
                    height={28}
                  />
                  <SheetTitle className="text-xl font-bold">
                    sktch Labs
                  </SheetTitle>
                </div>
              </SheetHeader>
              <div className="h-full">
                {/* Reusing Sidebar for mobile view, might need minor adjustments for full-height inside Sheet */}
                <div className="flex flex-col h-full">
                  <Sidebar />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:block hidden">
              {getPageTitle(pathname)}
            </h1>
            {getPageSubtitle(pathname) && (
              <p className="text-xs text-muted-foreground font-medium md:block hidden animate-in fade-in slide-in-from-left-1 duration-300">
                {getPageSubtitle(pathname)}
              </p>
            )}
          </div>

          {/* Show title on mobile too but maybe smaller */}
          <div className="flex flex-col md:hidden">
            <h1 className="text-lg font-semibold tracking-tight text-foreground truncate max-w-[150px]">
              {getPageTitle(pathname)}
            </h1>
            {getPageSubtitle(pathname) && (
              <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                {getPageSubtitle(pathname)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0"
              >
                <Avatar className="h-10 w-10 border border-border">
                  {user?.image ? (
                    <AvatarImage src={user.image} alt={user.name || "User"} />
                  ) : null}
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                    {getInitials(user?.name, user?.email)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "No email available"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
