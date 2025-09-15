"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { OverviewStats } from "@/components/progress/overview-stats"
import { MoodTrendChart } from "@/components/progress/mood-trend-chart"
import { ActivityChart } from "@/components/progress/activity-chart"
import { EngagementChart } from "@/components/progress/engagement-chart"
import { ProgressInsights } from "@/components/progress/progress-insights"
import { GoalTracking } from "@/components/progress/goal-tracking"
import { TrendingUp, Calendar, Target, Brain, Download } from "lucide-react"

interface ProgressAnalyticsProps {
  userId: string
  moodData: any[]
  sessionData: any[]
  activityData: any[]
}

export function ProgressAnalytics({ userId, moodData, sessionData, activityData }: ProgressAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30")

  const filterDataByTimeRange = (data: any[], days: number) => {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return data.filter((item) => new Date(item.created_at) >= cutoffDate)
  }

  const filteredMoodData = filterDataByTimeRange(moodData, Number.parseInt(timeRange))
  const filteredSessionData = filterDataByTimeRange(sessionData, Number.parseInt(timeRange))
  const filteredActivityData = filterDataByTimeRange(activityData, Number.parseInt(timeRange))

  const exportData = () => {
    const exportData = {
      mood_entries: filteredMoodData,
      chat_sessions: filteredSessionData.length,
      activities: filteredActivityData.length,
      export_date: new Date().toISOString(),
      time_range_days: timeRange,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mental-health-progress-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Analytics</h1>
          <p className="text-muted-foreground">Track your mental health journey and celebrate your progress</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <OverviewStats
        moodData={filteredMoodData}
        sessionData={filteredSessionData}
        activityData={filteredActivityData}
      />

      {/* Main Analytics */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <MoodTrendChart moodData={filteredMoodData} />
            <ProgressInsights
              moodData={filteredMoodData}
              sessionData={filteredSessionData}
              activityData={filteredActivityData}
            />
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <ActivityChart activityData={filteredActivityData} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <EngagementChart sessionData={filteredSessionData} moodData={filteredMoodData} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalTracking userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
