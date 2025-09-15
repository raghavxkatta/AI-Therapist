"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { useState } from "react"

interface MoodEntryData {
  id: string
  mood_score: number
  notes: string | null
  created_at: string
}

interface MoodCalendarProps {
  moodEntries: MoodEntryData[]
}

export function MoodCalendar({ moodEntries }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getMoodForDate = (date: Date) => {
    return moodEntries.find((entry) => isSameDay(new Date(entry.created_at), date))
  }

  const getMoodColor = (score: number) => {
    if (score <= 3) return "bg-red-200 text-red-800"
    if (score <= 5) return "bg-orange-200 text-orange-800"
    if (score <= 7) return "bg-yellow-200 text-yellow-800"
    return "bg-green-200 text-green-800"
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mood Calendar</span>
          <span className="text-lg font-normal">{format(currentDate, "MMMM yyyy")}</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Visual overview of your daily moods</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day) => {
            const moodEntry = getMoodForDate(day)
            const dayNumber = format(day, "d")

            return (
              <div
                key={day.toISOString()}
                className={`
                  aspect-square flex items-center justify-center text-sm rounded-lg border-2 border-transparent
                  ${
                    moodEntry
                      ? `${getMoodColor(moodEntry.mood_score)} border-current`
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }
                  ${isSameDay(day, new Date()) ? "ring-2 ring-primary" : ""}
                `}
                title={
                  moodEntry
                    ? `Mood: ${moodEntry.mood_score}/10${moodEntry.notes ? ` - ${moodEntry.notes}` : ""}`
                    : undefined
                }
              >
                <span className="font-medium">{dayNumber}</span>
                {moodEntry && <span className="absolute text-xs font-bold mt-4">{moodEntry.mood_score}</span>}
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span>Low (1-3)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-200 rounded"></div>
            <span>Fair (4-5)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Good (6-7)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Great (8-10)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
