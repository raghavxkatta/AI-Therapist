import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar />
            <main className="flex-1 ml-20 lg:ml-[280px] overflow-auto">{children}</main>
        </div>
    )
}
