"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Award, Target, Lightbulb } from "lucide-react"


interface MoodEntry {
  mood_score: number;
  created_at: string;
}
interface SessionEntry {
  messages?: { content: string }[];
  created_at: string;
}
interface ActivityEntry {
  created_at: string;
}

interface ProgressInsightsProps {
  moodData: MoodEntry[];
  sessionData: SessionEntry[];
  activityData: ActivityEntry[];
}

export function ProgressInsights({ moodData, sessionData, activityData }: ProgressInsightsProps) {
  const generateInsights = () => {
    const insights = []

    // Mood insights
    if (moodData.length >= 7) {
      const recent = moodData.slice(-7)
      const previous = moodData.slice(-14, -7)

      if (previous.length > 0) {
        const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_score, 0) / recent.length
        const previousAvg = previous.reduce((sum, entry) => sum + entry.mood_score, 0) / previous.length

        if (recentAvg > previousAvg + 0.5) {
          insights.push({
            type: "positive",
            icon: TrendingUp,
            title: "Mood Improvement",
            description: `Your mood has improved by ${Math.round((recentAvg - previousAvg) * 10) / 10} points this week!`,
            badge: "Great Progress",
          })
        } else if (recentAvg < previousAvg - 0.5) {
          insights.push({
            type: "attention",
            icon: TrendingDown,
            title: "Mood Decline",
            description: "Your mood has been lower recently. Consider scheduling more therapy sessions.",
            badge: "Needs Attention",
          })
        }
      }
    }

    // Consistency insights
    if (moodData.length >= 14) {
      const consistency = moodData.length / 14 // Assuming 14 days period
      if (consistency >= 0.8) {
        insights.push({
          type: "achievement",
          icon: Award,
          title: "Consistent Tracking",
          description: "Excellent job maintaining consistent mood tracking!",
          badge: "Achievement",
        })
      }
    }

    // Activity insights
    if (activityData.length >= 5) {
      insights.push({
        type: "positive",
        icon: Target,
        title: "Active Engagement",
        description: `You've completed ${activityData.length} therapeutic activities. Keep up the great work!`,
        badge: "Well Done",
      })
    }

    // Session insights
    const totalMessages = sessionData.reduce((sum, session) => sum + (session.messages?.length || 0), 0)
    if (totalMessages >= 50) {
      insights.push({
        type: "achievement",
        icon: Award,
        title: "Therapy Milestone",
        description: `You've exchanged ${totalMessages} messages in therapy sessions. That's dedication!`,
        badge: "Milestone",
      })
    }

    // Recommendations
    if (moodData.length < 7) {
      insights.push({
        type: "suggestion",
        icon: Lightbulb,
        title: "Track More Regularly",
        description: "Try logging your mood daily for better insights into your mental health patterns.",
        badge: "Suggestion",
      })
    }

    if (sessionData.length < 3) {
      insights.push({
        type: "suggestion",
        icon: Lightbulb,
        title: "Try AI Therapy",
        description: "Regular therapy sessions can help you process emotions and develop coping strategies.",
        badge: "Suggestion",
      })
    }

    return insights
  }

  const insights = generateInsights()

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "positive":
      case "achievement":
        return "default"
      case "attention":
        return "destructive"
      case "suggestion":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "positive":
      case "achievement":
        return "text-green-600"
      case "attention":
        return "text-red-600"
      case "suggestion":
        return "text-blue-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Insights</CardTitle>
        <p className="text-sm text-muted-foreground">Personalized insights based on your mental health journey</p>
      </CardHeader>
      <CardContent>
        {insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <insight.icon className={`h-5 w-5 mt-0.5 ${getIconColor(insight.type)}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                      {insight.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Keep Going!</p>
            <p className="text-sm">Continue using the app to unlock personalized insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
