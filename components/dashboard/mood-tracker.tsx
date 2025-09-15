"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Textarea } from "@/app/components/ui/textarea"
import { Smile, Meh, Frown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MoodTrackerProps {
  userId: string
}

export function MoodTracker({ userId }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentMood, setRecentMood] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    loadRecentMood()
  }, [])

  const loadRecentMood = async () => {
    const { data } = await supabase
      .from("mood_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (data) {
      setRecentMood(data)
    }
  }

  const saveMood = async () => {
    if (!selectedMood) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("mood_entries").insert({
        user_id: userId,
        mood_score: selectedMood,
        notes: notes.trim() || null,
      })

      if (!error) {
        setSelectedMood(null)
        setNotes("")
        loadRecentMood()
      }
    } catch (error) {
      console.error("Error saving mood:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodIcon = (score: number) => {
    if (score <= 3) return <Frown className="h-6 w-6 text-red-500" />
    if (score <= 7) return <Meh className="h-6 w-6 text-yellow-500" />
    return <Smile className="h-6 w-6 text-green-500" />
  }

  const getMoodLabel = (score: number) => {
    if (score <= 3) return "Struggling"
    if (score <= 7) return "Okay"
    return "Great"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Mood Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentMood && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              {getMoodIcon(recentMood.mood_score)}
              <span className="text-sm font-medium">{getMoodLabel(recentMood.mood_score)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{new Date(recentMood.created_at).toLocaleDateString()}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-3">How are you feeling right now?</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMood(mood)}
                className="h-10"
              >
                {mood}
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Very Low</span>
            <span>Very High</span>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Notes (optional)</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's contributing to how you feel today?"
            className="min-h-[80px]"
          />
        </div>

        <Button onClick={saveMood} disabled={!selectedMood || isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Mood"}
        </Button>
      </CardContent>
    </Card>
  )
}
