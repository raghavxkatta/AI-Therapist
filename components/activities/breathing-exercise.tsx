"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"
import { Play, Pause, RotateCcw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycle, setCycle] = useState(0)
  const [totalCycles, setTotalCycles] = useState(5)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const phaseDurations = {
    inhale: 4,
    hold: 4,
    exhale: 6,
  }

  const phaseInstructions = {
    inhale: "Breathe in slowly through your nose",
    hold: "Hold your breath gently",
    exhale: "Exhale slowly through your mouth",
  }

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (phase === "inhale") {
        setPhase("hold")
        setTimeLeft(phaseDurations.hold)
      } else if (phase === "hold") {
        setPhase("exhale")
        setTimeLeft(phaseDurations.exhale)
      } else if (phase === "exhale") {
        setCycle(cycle + 1)
        if (cycle + 1 >= totalCycles) {
          setIsActive(false)
          setPhase("inhale")
          setTimeLeft(phaseDurations.inhale)
          setCycle(0)
        } else {
          setPhase("inhale")
          setTimeLeft(phaseDurations.inhale)
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [isActive, timeLeft, phase, cycle, totalCycles])

  const startExercise = () => {
    setIsActive(true)
  }

  const pauseExercise = () => {
    setIsActive(false)
  }

  const resetExercise = () => {
    setIsActive(false)
    setPhase("inhale")
    setTimeLeft(phaseDurations.inhale)
    setCycle(0)
  }

  const progress = ((totalCycles - (totalCycles - cycle)) / totalCycles) * 100

  const getCircleScale = () => {
    const baseScale = 0.8
    const maxScale = 1.2
    const phaseProgress = (phaseDurations[phase] - timeLeft) / phaseDurations[phase]

    if (phase === "inhale") {
      return baseScale + (maxScale - baseScale) * phaseProgress
    } else if (phase === "exhale") {
      return maxScale - (maxScale - baseScale) * phaseProgress
    }
    return maxScale
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/activities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
          </Button>
        </Link>
      </div>

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Breathing Exercise</CardTitle>
          <p className="text-muted-foreground">Follow the guided breathing pattern to reduce stress and anxiety</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Cycle {cycle + 1} of {totalCycles}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Breathing Circle */}
          <div className="flex items-center justify-center py-8">
            <div
              className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center transition-transform duration-1000 ease-in-out"
              style={{
                transform: `scale(${getCircleScale()})`,
              }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{timeLeft}</div>
                <div className="text-sm font-medium text-primary/80 uppercase tracking-wide">{phase}</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <p className="text-lg font-medium">{phaseInstructions[phase]}</p>
            <p className="text-sm text-muted-foreground">
              {phase === "inhale" && "Fill your lungs completely and slowly"}
              {phase === "hold" && "Keep your breath steady and relaxed"}
              {phase === "exhale" && "Release all the air slowly and completely"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isActive ? (
              <Button onClick={startExercise} size="lg">
                <Play className="h-5 w-5 mr-2" />
                {cycle === 0 ? "Start" : "Resume"}
              </Button>
            ) : (
              <Button onClick={pauseExercise} variant="secondary" size="lg">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetExercise} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </div>

          {/* Cycle Settings */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Cycles:</span>
            {[3, 5, 10].map((count) => (
              <Button
                key={count}
                variant={totalCycles === count ? "default" : "outline"}
                size="sm"
                onClick={() => setTotalCycles(count)}
                disabled={isActive}
              >
                {count}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
