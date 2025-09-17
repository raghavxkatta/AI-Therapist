"use client";

import { motion } from "framer-motion";
import { ChatInterface } from "@/components/dashboard/chat-interface";
import { MoodTracker } from "@/components/dashboard/mood-tracker";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, MessageCircle, TrendingUp, Activity } from "lucide-react";

// Define the shape of the props this component expects
interface DashboardContentProps {
    userId: string;
    displayName: string;
}

export function DashboardContent({ userId, displayName }: DashboardContentProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <Brain className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Welcome back, {displayName}</h1>
                </div>
                <p className="text-muted-foreground">
                    How are you feeling today? I&apos;m here to support your mental wellness journey.
                </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mood Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7.2</div>
                        <p className="text-xs text-muted-foreground">+0.5 from yesterday</p>
                    </CardContent>
                </Card>

                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Activities</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">This week</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Chat Interface */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="lg:col-span-2"
                >
                    <ChatInterface userId={userId} />
                </motion.div>

                {/* Right Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-6"
                >
                    <MoodTracker userId={userId} />
                    <QuickActions />
                </motion.div>
            </div>
        </div>
    );
}