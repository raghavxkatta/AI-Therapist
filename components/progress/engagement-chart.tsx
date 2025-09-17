"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, parseISO, endOfWeek, eachWeekOfInterval, subWeeks } from "date-fns"

interface SessionEntry {
  created_at: string;
  messages?: { content: string }[];
}
interface MoodEntry {
  created_at: string;
  mood_score: number;
}
interface EngagementChartProps {
  sessionData: SessionEntry[];
  moodData: MoodEntry[];
}

export function EngagementChart({ sessionData, moodData }: EngagementChartProps) {
  const generateWeeklyData = () => {
    const endDate = new Date()
    const startDate = subWeeks(endDate, 12) // Last 12 weeks

    const weeks = eachWeekOfInterval({ start: startDate, end: endDate })

    return weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart)
      const weekLabel = format(weekStart, "MMM dd")

      const weekSessions = sessionData.filter((session) => {
        const sessionDate = parseISO(session.created_at)
        return sessionDate >= weekStart && sessionDate <= weekEnd
      })

      const weekMoods = moodData.filter((mood) => {
        const moodDate = parseISO(mood.created_at)
        return moodDate >= weekStart && moodDate <= weekEnd
      })

      const totalMessages = weekSessions.reduce((sum, session) => sum + (session.messages?.length || 0), 0)

      const avgMood =
        weekMoods.length > 0 ? weekMoods.reduce((sum, mood) => sum + mood.mood_score, 0) / weekMoods.length : 0

      return {
        week: weekLabel,
        sessions: weekSessions.length,
        messages: totalMessages,
        moodEntries: weekMoods.length,
        avgMood: Math.round(avgMood * 10) / 10,
      }
    })
  }

  const chartData = generateWeeklyData()

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { name: string; value: number; color?: string }[];
    label?: string;
  }
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Week of {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Engagement</CardTitle>
        <p className="text-sm text-muted-foreground">Your therapy sessions and mood tracking activity over time</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="week" className="text-muted-foreground" fontSize={12} />
            <YAxis className="text-muted-foreground" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="sessions"
              stackId="1"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
              name="Sessions"
            />
            <Area
              type="monotone"
              dataKey="moodEntries"
              stackId="1"
              stroke="hsl(var(--secondary))"
              fill="hsl(var(--secondary))"
              fillOpacity={0.6}
              name="Mood Entries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
