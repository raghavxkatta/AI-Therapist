"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ActivityChartProps {
  activityData: any[]
}

export function ActivityChart({ activityData }: ActivityChartProps) {
  const activityCounts = activityData.reduce(
    (acc, activity) => {
      const type = activity.activity_type || "Unknown"
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(activityCounts).map(([type, count]) => ({
    activity: type.charAt(0).toUpperCase() + type.slice(1).replace("_", " "),
    count,
    duration: activityData
      .filter((a) => a.activity_type === type)
      .reduce((sum, a) => sum + (a.duration_minutes || 0), 0),
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">
            Sessions: <span className="font-bold">{payload[0].value}</span>
          </p>
          <p className="text-sm text-muted-foreground">Total time: {data.duration} minutes</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Engagement</CardTitle>
        <p className="text-sm text-muted-foreground">Your participation in different therapeutic activities</p>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="activity" className="text-muted-foreground" fontSize={12} />
              <YAxis className="text-muted-foreground" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-300 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">No activity data yet</p>
              <p className="text-sm">Try our therapeutic activities to see your engagement</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
