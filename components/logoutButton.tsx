"use client"
import { createClient } from "@/lib/supabase/client"

import { useState } from "react"

interface LogoutButtonProps {
    collapsed?: boolean
}

export function LogoutButton({ collapsed }: LogoutButtonProps) {
    const [loading, setLoading] = useState(false)
    const handleLogout = async () => {
        setLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        window.location.href = "/auth/signin"
    }

    return (
        <button
            onClick={handleLogout}
            disabled={loading}
            className={
                collapsed
                    ? `flex items-center justify-center rounded-full w-12 h-12 shadow transition-all duration-200 mt-4
                        ${loading ? "bg-blue-200 text-blue-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"}`
                    : `flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold shadow w-full transition-all duration-200 mt-4
                        ${loading ? "bg-blue-200 text-blue-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"}`
            }
            aria-label="Log out"
        >
            {loading ? (
                <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
            ) : (
                <>
                    <svg className="h-5 w-5 flex-shrink-0 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                    </svg>
                    {!collapsed && <span className="font-medium text-sm">Log out</span>}
                </>
            )}
        </button>
    )
}