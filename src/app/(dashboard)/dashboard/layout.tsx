import type { Metadata } from "next";
import Sidebar from "@/components/sheard/Sidebar";
import Header from "@/components/sheard/Header";
import { SidebarLayoutWrapper } from "./SidebarLayoutWrapper";

export const metadata: Metadata = {
  title: "Dashboard Template.",
  description:
    "A modern dashboard template built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <SidebarLayoutWrapper>
        <Header />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarLayoutWrapper>
    </div>
  );
}
