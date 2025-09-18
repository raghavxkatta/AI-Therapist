"use client"

import type { ElementType } from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "../../components/logoutButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    Activity, BarChart3, Brain, Heart, HelpCircle, Home, Menu,
    MessageCircle, Palette, Settings, Shield, TreePine, Waves, Wind, X
} from "lucide-react"

// Define a type for a single navigation item
interface NavItem {
    title: string;
    href: string;
    icon: ElementType;
    description: string;
}

// --- DATA ---
const navigationItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home, description: "Overview and quick actions" },
    { title: "Mood Tracking", href: "/mood", icon: Heart, description: "Track and analyze your emotions" },
    { title: "Progress", href: "/progress", icon: BarChart3, description: "View your mental health journey" },
    { title: "Activities", href: "/activities", icon: Activity, description: "Browse all therapeutic activities" },
]

const supportItems: NavItem[] = [
    { title: "Crisis Support", href: "/crisis", icon: Shield, description: "Emergency mental health resources" },
    { title: "Settings", href: "/settings", icon: Settings, description: "Customize your experience" },
    { title: "Help & Support", href: "/help", icon: HelpCircle, description: "Get help and learn more" },
]

// Define props for the reusable section component
interface NavigationSectionProps {
    title: string;
    items: NavItem[];
    isCollapsed: boolean;
    pathname: string;
}

function NavigationSection({ title, items, isCollapsed, pathname }: NavigationSectionProps) {
    if (isCollapsed) {
        // Spread out icons vertically when collapsed
        return (
            <nav className="flex flex-col items-center gap-y-8 py-4 h-full">
                {items.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                        <Link key={item.title} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                        : "text-sidebar-foreground",
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>
        );
    }
    // Default expanded layout
    return (
        <div>
            <AnimatePresence>
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-3 mb-3 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider"
                >
                    {title}
                </motion.h3>
            </AnimatePresence>
            <nav className="space-y-3">
                {items.map((item) => {
                    const isActive = item.href === "/dashboard"
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                        <Link key={item.title} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isActive
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                        : "text-sidebar-foreground",
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-1 min-w-0"
                                    >
                                        <div className="font-medium text-sm">{item.title}</div>
                                        <div className="text-xs opacity-70 truncate">{item.description}</div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

// Define props for the main Sidebar component
interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 80 },
    }

    return (
        <motion.div
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shadow-lg", className)}
        >
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <Brain className="h-8 w-8 text-sidebar-primary" />
                            <h1 className="text-xl font-bold text-sidebar-foreground">MindfulAI</h1>
                        </motion.div>
                    )}
                </AnimatePresence>
                <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0 hover:bg-sidebar-accent">
                    {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </Button>
            </div>

            <ScrollArea className="flex-1 px-3  py-4">
                <div className="space-y-12">
                    <NavigationSection title="Main" items={navigationItems} isCollapsed={isCollapsed} pathname={pathname} />
                    <NavigationSection title="Support" items={supportItems} isCollapsed={isCollapsed} pathname={pathname} />
                </div>
            </ScrollArea>
            <div className="mt-auto  flex flex-col items-center gap-1 w-full">
                <ThemeToggle />
                <Separator className=" w-2/3 mx-auto" />
                <LogoutButton collapsed={isCollapsed} />
            </div>
        </motion.div>
    )
}