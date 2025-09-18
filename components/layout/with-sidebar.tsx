"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { usePathname } from "next/navigation"
import React from "react"

export function WithSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/" || pathname.startsWith("/auth");

  return (
    <div className="flex h-screen bg-background">
      {!hideSidebar && <Sidebar />}
      <main className={hideSidebar ? "flex-1" : "flex-1 ml-20 lg:ml-[280px] overflow-auto"}>{children}</main>
    </div>
  );
}
