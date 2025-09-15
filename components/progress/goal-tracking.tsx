"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Plus, CheckCircle, Circle, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Goal {
  id: string
  title: string
  description: string
  target_value: number
  current_value: number
  unit: string
  deadline: string
  status: "active" | "completed" | "paused"
  created_at: string
}

interface GoalTrackingProps {
  userId: string
}

export function GoalTracking({ userId }: GoalTrackingProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target_value: 0,
    unit: "",
    deadline: "",
  })
  const supabase = createClient()

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    const { data } = await supabase
      .from("user_goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) {
      setGoals(data)
    }
  }

  const createGoal = async () => {
    if (!newGoal.title.trim()) return

    const { error } = await supabase.from("user_goals").insert({
      user_id: userId,
      title: newGoal.title,
      description: newGoal.description,
      target_value: newGoal.target_value,
      current_value: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      status: "active",
    })

    if (!error) {
      setNewGoal({ title: "", description: "", target_value: 0, unit: "", deadline: "" })
      setShowAddGoal(false)
      loadGoals()
    }
  }

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    const { error } = await supabase.from("user_goals").update({ current_value: newValue }).eq("id", goalId)

    if (!error) {
      loadGoals()
    }
  }

  const toggleGoalStatus = async (goalId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "completed" : "active"

    const { error } = await supabase.from("user_goals").update({ status: newStatus }).eq("id", goalId)

    if (!error) {
      loadGoals()
    }
  }

  const deleteGoal = async (goalId: string) => {
    const { error } = await supabase.from("user_goals").delete().eq("id", goalId)

    if (!error) {
      loadGoals()
    }
  }

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100)
  }

  const defaultGoals = [
    {
      title: "Daily Mood Tracking",
      description: "Log your mood every day for better self-awareness",
      target_value: 30,
      unit: "days",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      title: "Weekly Therapy Sessions",
      description: "Have at least 2 AI therapy sessions per week",
      target_value: 8,
      unit: "sessions",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
    {
      title: "Mindfulness Activities",
      description: "Complete therapeutic activities regularly",
      target_value: 15,
      unit: "activities",
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  ]

  const addDefaultGoal = async (defaultGoal: any) => {
    const { error } = await supabase.from("user_goals").insert({
      user_id: userId,
      title: defaultGoal.title,
      description: defaultGoal.description,
      target_value: defaultGoal.target_value,
      current_value: 0,
      unit: defaultGoal.unit,
      deadline: defaultGoal.deadline,
      status: "active",
    })

    if (!error) {
      loadGoals()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Goal Tracking</h2>
          <p className="text-muted-foreground">Set and track your mental health goals</p>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 && !showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Get Started with Goals</CardTitle>
            <p className="text-sm text-muted-foreground">Choose from these suggested goals or create your own</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {defaultGoals.map((goal, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{goal.title}</h4>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Target: {goal.target_value} {goal.unit}
                  </p>
                </div>
                <Button onClick={() => addDefaultGoal(goal)} size="sm">
                  Add Goal
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showAddGoal && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Goal Title</label>
              <Input
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Daily meditation practice"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                placeholder="Describe your goal and why it's important to you"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Target Value</label>
                <Input
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal({ ...newGoal, target_value: Number.parseInt(e.target.value) || 0 })}
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Unit</label>
                <Input
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                  placeholder="e.g., days, sessions, minutes"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Deadline</label>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createGoal}>Create Goal</Button>
              <Button variant="outline" onClick={() => setShowAddGoal(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge variant={goal.status === "completed" ? "default" : "secondary"}>{goal.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => toggleGoalStatus(goal.id, goal.status)}>
                    {goal.status === "completed" ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteGoal(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </span>
                </div>
                <Progress value={getProgressPercentage(goal)} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(getProgressPercentage(goal))}% complete
                </p>
              </div>

              {goal.status === "active" && (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Update progress"
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        const value = Number.parseInt((e.target as HTMLInputElement).value)
                        if (value >= 0) {
                          updateGoalProgress(goal.id, value)
                          ;(e.target as HTMLInputElement).value = ""
                        }
                      }
                    }}
                  />
                  <Button size="sm" variant="outline">
                    Update
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
