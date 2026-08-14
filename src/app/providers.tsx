// app/providers.tsx
"use client";
import { ToastProvider } from "@heroui/toast";
import { usePathname } from "next/navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={pathname.startsWith("/marketer") ? "flex-1 w-full mx-auto lg:px-0 h-full flex flex-col" : "flex flex-col h-full flex-1"}>
      <ToastProvider placement="top-center" />
      {children}
    </div>
  );
}