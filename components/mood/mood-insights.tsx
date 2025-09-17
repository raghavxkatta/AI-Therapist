"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Lightbulb } from "lucide-react"

interface MoodEntryData {
  id: string
  mood_score: number
  notes: string | null
  created_at: string
}

interface MoodInsightsProps {
  moodEntries: MoodEntryData[]
}

export function MoodInsights({ moodEntries }: MoodInsightsProps) {
  if (moodEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No insights yet</p>
            <p className="text-muted-foreground">Log more moods to see personalized insights</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getMoodDistribution = () => {
    const distribution = { low: 0, fair: 0, good: 0, great: 0 }

    moodEntries.forEach((entry) => {
      if (entry.mood_score <= 3) distribution.low++
      else if (entry.mood_score <= 5) distribution.fair++
      else if (entry.mood_score <= 7) distribution.good++
      else distribution.great++
    })

    const total = moodEntries.length
    return {
      low: Math.round((distribution.low / total) * 100),
      fair: Math.round((distribution.fair / total) * 100),
      good: Math.round((distribution.good / total) * 100),
      great: Math.round((distribution.great / total) * 100),
    }
  }

  const getWeeklyTrend = () => {
    if (moodEntries.length < 7) return null

    const recent = moodEntries.slice(0, 7)
    const previous = moodEntries.slice(7, 14)

    if (previous.length === 0) return null

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_score, 0) / recent.length
    const previousAvg = previous.reduce((sum, entry) => sum + entry.mood_score, 0) / previous.length

    const change = recentAvg - previousAvg

    return {
      change: Math.round(change * 10) / 10,
      percentage: Math.round(Math.abs(change / previousAvg) * 100),
      direction: change > 0.5 ? "up" : change < -0.5 ? "down" : "stable",
    }
  }

  const getBestDay = () => {
    if (moodEntries.length === 0) return null

    const best = moodEntries.reduce((prev, current) => (current.mood_score > prev.mood_score ? current : prev))

    return {
      score: best.mood_score,
      date: new Date(best.created_at).toLocaleDateString(),
      notes: best.notes,
    }
  }

  const getRecommendations = () => {
    const avgMood = moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length
    const recommendations = []

    if (avgMood < 5) {
      recommendations.push("Consider scheduling a chat with our AI therapist")
      recommendations.push("Try our breathing exercises when feeling overwhelmed")
      recommendations.push("Regular mood logging can help identify patterns")
    } else if (avgMood < 7) {
      recommendations.push("You're doing well! Try our zen garden for relaxation")
      recommendations.push("Consider forest walk sessions for mental clarity")
      recommendations.push("Keep up the consistent mood tracking")
    } else {
      recommendations.push("Great job maintaining positive mental health!")
      recommendations.push("Share your strategies in therapy sessions")
      recommendations.push("Consider helping others through peer support")
    }

    return recommendations
  }

  const distribution = getMoodDistribution()
  const weeklyTrend = getWeeklyTrend()
  const bestDay = getBestDay()
  const recommendations = getRecommendations()

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Mood Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">How often you experience different mood levels</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Great (8-10)</span>
              <span className="text-sm font-medium">{distribution.great}%</span>
            </div>
            <Progress value={distribution.great} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Good (6-7)</span>
              <span className="text-sm font-medium">{distribution.good}%</span>
            </div>
            <Progress value={distribution.good} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Fair (4-5)</span>
              <span className="text-sm font-medium">{distribution.fair}%</span>
            </div>
            <Progress value={distribution.fair} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Low (1-3)</span>
              <span className="text-sm font-medium">{distribution.low}%</span>
            </div>
            <Progress value={distribution.low} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Trend</CardTitle>
          <p className="text-sm text-muted-foreground">How your mood changed this week</p>
        </CardHeader>
        <CardContent>
          {weeklyTrend ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                {weeklyTrend.direction === "up" && <TrendingUp className="h-8 w-8 text-green-500" />}
                {weeklyTrend.direction === "down" && <TrendingDown className="h-8 w-8 text-red-500" />}
                {weeklyTrend.direction === "stable" && <Minus className="h-8 w-8 text-yellow-500" />}
                <span className="text-2xl font-bold">
                  {weeklyTrend.direction === "up" && "+"}
                  {weeklyTrend.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {weeklyTrend.direction === "up" && `Your mood improved by ${weeklyTrend.percentage}% this week`}
                {weeklyTrend.direction === "down" && `Your mood decreased by ${weeklyTrend.percentage}% this week`}
                {weeklyTrend.direction === "stable" && "Your mood has been stable this week"}
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Need more data to show weekly trends</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Best Day */}
      {bestDay && (
        <Card>
          <CardHeader>
            <CardTitle>Best Day</CardTitle>
            <p className="text-sm text-muted-foreground">Your highest mood entry</p>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">{bestDay.score}/10</div>
              <p className="text-sm text-muted-foreground">{bestDay.date}</p>
              {bestDay.notes && <p className="text-sm italic">&quot;{bestDay.notes}&quot;</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <p className="text-sm text-muted-foreground">Personalized suggestions based on your mood patterns</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
