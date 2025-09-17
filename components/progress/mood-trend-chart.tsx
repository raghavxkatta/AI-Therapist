"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { format, parseISO } from "date-fns"

interface MoodEntry {
  created_at: string;
  mood_score: number;
  notes?: string;
}
interface MoodTrendChartProps {
  moodData: MoodEntry[];
}

export function MoodTrendChart({ moodData }: MoodTrendChartProps) {
  const chartData = moodData.map((entry) => ({
    date: format(parseISO(entry.created_at), "MMM dd"),
    mood: entry.mood_score,
    fullDate: entry.created_at,
    notes: entry.notes,
  }))

  const averageMood =
    moodData.length > 0 ? moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length : 5

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
          {data.notes && <p className="text-sm text-muted-foreground mt-1 max-w-48">&quot;{data.notes}&quot;</p>}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mood Trend Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Your mood progression over time with average reference line</p>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
              <YAxis domain={[1, 10]} className="text-muted-foreground" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={averageMood}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                label={{ value: `Avg: ${Math.round(averageMood * 10) / 10}`, position: "right" }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No mood data yet</p>
              <p className="text-sm">Start tracking your mood to see progress over time</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
