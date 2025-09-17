"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"

interface MoodEntryData {
  id: string
  mood_score: number
  notes: string | null
  created_at: string
}

interface MoodChartProps {
  moodEntries: MoodEntryData[]
}

export function MoodChart({ moodEntries }: MoodChartProps) {
  const chartData = moodEntries
    .slice()
    .reverse()
    .map((entry) => ({
      date: format(new Date(entry.created_at), "MMM dd"),
      mood: entry.mood_score,
      fullDate: entry.created_at,
      notes: entry.notes,
    }))

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { value: number; payload: { notes?: string } }[];
    label?: string;
  }
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Mood: <span className="font-bold">{payload[0].value}/10</span>
          </p>
          {data.notes && <p className="text-sm text-muted-foreground mt-1">&quot;{data.notes}&quot;</p>}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trend</CardTitle>
        <p className="text-sm text-muted-foreground">Your mood over the last 30 entries</p>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
              <YAxis domain={[1, 10]} className="text-muted-foreground" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No mood data yet</p>
              <p className="text-sm">Start logging your mood to see trends over time</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
