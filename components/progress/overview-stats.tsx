"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageCircle, Activity, Calendar, Target } from "lucide-react"


interface MoodEntry {
  mood_score: number;
  [key: string]: any;
}
interface SessionEntry {
  messages?: { [key: string]: any }[];
  [key: string]: any;
}
interface ActivityEntry {
  [key: string]: any;
}

interface OverviewStatsProps {
  moodData: MoodEntry[];
  sessionData: SessionEntry[];
  activityData: ActivityEntry[];
}

export function OverviewStats({ moodData, sessionData, activityData }: OverviewStatsProps) {
  const calculateMoodTrend = () => {
    if (moodData.length < 2) return { trend: 0, direction: "stable" }

    const recent = moodData.slice(-7)
    const previous = moodData.slice(-14, -7)

    if (recent.length === 0 || previous.length === 0) return { trend: 0, direction: "stable" }

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_score, 0) / recent.length
    const previousAvg = previous.reduce((sum, entry) => sum + entry.mood_score, 0) / previous.length

    const trend = ((recentAvg - previousAvg) / previousAvg) * 100
    const direction = trend > 5 ? "up" : trend < -5 ? "down" : "stable"

    return { trend: Math.abs(trend), direction }
  }

  const averageMood =
    moodData.length > 0
      ? Math.round((moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length) * 10) / 10
      : 0

  const totalMessages = sessionData.reduce((sum, session) => sum + (session.messages?.length || 0), 0)
  const moodTrend = calculateMoodTrend()

  const stats = [
    {
      title: "Average Mood",
      value: `${averageMood}/10`,
      description: "Overall mood rating",
      icon: Target,
      trend:
        moodTrend.direction === "up"
          ? "+" + Math.round(moodTrend.trend) + "%"
          : moodTrend.direction === "down"
            ? "-" + Math.round(moodTrend.trend) + "%"
            : "Stable",
      trendDirection: moodTrend.direction,
    },
    {
      title: "Therapy Sessions",
      value: sessionData.length.toString(),
      description: "AI chat sessions completed",
      icon: MessageCircle,
      trend: sessionData.length > 0 ? `${totalMessages} messages` : "Get started",
      trendDirection: "neutral",
    },
    {
      title: "Activities Completed",
      value: activityData.length.toString(),
      description: "Therapeutic activities",
      icon: Activity,
      trend: activityData.length > 0 ? "Active engagement" : "Try activities",
      trendDirection: "neutral",
    },
    {
      title: "Mood Entries",
      value: moodData.length.toString(),
      description: "Days tracked",
      icon: Calendar,
      trend: moodData.length > 7 ? "Great consistency!" : "Keep logging",
      trendDirection: "neutral",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div
                className={`flex items-center text-xs ${
                  stat.trendDirection === "up"
                    ? "text-green-600"
                    : stat.trendDirection === "down"
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {stat.trendDirection === "up" && <TrendingUp className="h-3 w-3 mr-1" />}
                {stat.trendDirection === "down" && <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.trend}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
