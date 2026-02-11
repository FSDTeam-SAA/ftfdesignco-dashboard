import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome!",
  description:
    "Welcome to FTF Design Co.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-screen bg-secondary flex items-center justify-center">
      {children}
    </div>
  );
}
