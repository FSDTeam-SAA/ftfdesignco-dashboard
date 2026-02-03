"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Users,
  ShoppingCart,
  CreditCard,
  BadgeInfo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLogout } from "@/features/auth/hooks/uselogout";
import { Loader2 } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Shipping Info",
    href: "/dashboard/shipping-info",
    icon: BadgeInfo,
  },
  {
    title: "Inventory Page",
    href: "/dashboard/inventory-page",
    icon: CreditCard,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed, isMobileOpen, setMobileOpen } =
    useSidebarStore();

  // Close mobile sidebar on route change
  React.useEffect(() => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname, isMobileOpen, setMobileOpen]);

  // Logout function
  const { loading: isLoggingOut, handleLogout } = useLogout();

  const SidebarContent = (
    <div className="flex flex-col  h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo Section */}
      <div className="relative flex items-center p-6 h-20">
        {/* Centered Logo */}
        {!isCollapsed && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <Image src="/images/logo.png" alt="Logo" width={64} height={64} />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="hidden md:flex ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-sidebar-accent font-medium text-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground font-medium",
                isCollapsed && "justify-center px-2 text-primary",
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  "shrink-0",
                  isActive
                    ? "text-primary"
                    : "group-hover:text-sidebar-foreground",
                )}
              />
              {!isCollapsed && <span>{item.title}</span>}

              {/* Active indicator */}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full text-primary font-bold" />
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover  text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-md text-primary">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section (Logout) */}
      <div className="p-4 border-t border-sidebar-border mt-auto text-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 hover:text-destructive hover:bg-destructive/10 text-red-500",
                isCollapsed && "justify-center px-2",
              )}
              disabled={isLoggingOut}
            >
              <LogOut size={20} />
              {!isCollapsed && <span>Logout</span>}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will end your current session and you will need to log in
                again to access your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoggingOut}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                disabled={isLoggingOut}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
        )}
      >
        {SidebarContent}
      </aside>
    </>
  );
}
