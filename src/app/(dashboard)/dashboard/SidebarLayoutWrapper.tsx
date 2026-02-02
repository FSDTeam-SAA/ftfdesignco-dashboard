"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/lib/store/sidebar-store";

export function SidebarLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div
      className={cn(
        "flex-1 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "md:pl-20" : "md:pl-64",
      )}
    >
      {children}
    </div>
  );
}
