"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Textarea } from "@/app/components/ui/textarea"
import { X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface MoodEntryProps {
  userId: string
  onSaved: () => void
  onCancel: () => void
}

export function MoodEntry({ userId, onSaved, onCancel }: MoodEntryProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

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
        onSaved()
      }
    } catch (error) {
      console.error("Error saving mood:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMoodLabel = (score: number) => {
    if (score <= 2) return "Very Low"
    if (score <= 4) return "Low"
    if (score <= 6) return "Okay"
    if (score <= 8) return "Good"
    return "Excellent"
  }

  const getMoodEmoji = (score: number) => {
    if (score <= 2) return "😢"
    if (score <= 4) return "😕"
    if (score <= 6) return "😐"
    if (score <= 8) return "🙂"
    return "😊"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>How are you feeling?</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-4">Rate your mood from 1 to 10</p>
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMood(mood)}
                className="h-12 flex flex-col"
              >
                <span className="text-lg">{mood}</span>
              </Button>
            ))}
          </div>

          {selectedMood && (
            <div className="text-center mt-4">
              <div className="text-2xl mb-1">{getMoodEmoji(selectedMood)}</div>
              <p className="text-sm font-medium">{getMoodLabel(selectedMood)}</p>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium mb-2">Notes (optional)</p>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What's contributing to how you feel today?"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={saveMood} disabled={!selectedMood || isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Mood"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
