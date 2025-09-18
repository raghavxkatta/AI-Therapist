"use client"
import { Sidebar } from "@/components/layout/sidebar"
import { usePathname } from "next/navigation"
import React from "react"

export function WithSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/" || pathname.startsWith("/auth");

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar overlays on mobile, static on md+ */}
      {!hideSidebar && (
        <div className="fixed md:static z-40 inset-y-0 left-0 w-4/5 max-w-xs md:w-[280px] transition-transform md:translate-x-0 bg-background border-r border-border shadow-lg md:block">
          <Sidebar />
        </div>
      )}
      <main className={hideSidebar ? "flex-1" : "flex-1 md:ml-[280px] ml-0 w-full min-w-0 overflow-auto"}>
        {children}
      </main>
    </div>
  );
}
