"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { MoodChart } from "@/components/mood/mood-chart"
import { MoodCalendar } from "@/components/mood/mood-calendar"
import { MoodInsights } from "@/components/mood/mood-insights"
import { MoodEntry } from "@/components/mood/mood-entry"
import { TrendingUp, Calendar, Brain, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MoodEntryData {
  id: string
  mood_score: number
  notes: string | null
  created_at: string
}

interface MoodDashboardProps {
  userId: string
  initialMoodEntries: MoodEntryData[]
}

export function MoodDashboard({ userId, initialMoodEntries }: MoodDashboardProps) {
  const [moodEntries, setMoodEntries] = useState<MoodEntryData[]>(initialMoodEntries)
  const [showMoodEntry, setShowMoodEntry] = useState(false)
  const supabase = createClient()

  const refreshMoodEntries = async () => {
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)

    if (data) {
      setMoodEntries(data)
    }
  }

  const handleMoodSaved = () => {
    setShowMoodEntry(false)
    refreshMoodEntries()
  }

  const averageMood =
    moodEntries.length > 0
      ? Math.round((moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length) * 10) / 10
      : 0

  const getMoodTrend = () => {
    if (moodEntries.length < 2) return "neutral"

    const recent = moodEntries.slice(0, 7)
    const older = moodEntries.slice(7, 14)

    if (recent.length === 0 || older.length === 0) return "neutral"

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_score, 0) / recent.length
    const olderAvg = older.reduce((sum, entry) => sum + entry.mood_score, 0) / older.length

    if (recentAvg > olderAvg + 0.5) return "improving"
    if (recentAvg < olderAvg - 0.5) return "declining"
    return "stable"
  }

  const moodTrend = getMoodTrend()

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mood Tracking</h1>
          <p className="text-muted-foreground">Monitor your emotional well-being over time</p>
        </div>
        <Button onClick={() => setShowMoodEntry(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Mood
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMood}/10</div>
            <p className="text-xs text-muted-foreground">Last 30 entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trend</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{moodTrend}</div>
            <p className="text-xs text-muted-foreground">
              {moodTrend === "improving" && "Your mood is getting better"}
              {moodTrend === "declining" && "Consider reaching out for support"}
              {moodTrend === "stable" && "Your mood is consistent"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodEntries.length}</div>
            <p className="text-xs text-muted-foreground">Total logged moods</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="chart" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">Chart View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-6">
          <MoodChart moodEntries={moodEntries} />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <MoodCalendar moodEntries={moodEntries} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <MoodInsights moodEntries={moodEntries} />
        </TabsContent>
      </Tabs>

      {/* Mood Entry Modal */}
      {showMoodEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full">
            <MoodEntry userId={userId} onSaved={handleMoodSaved} onCancel={() => setShowMoodEntry(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
