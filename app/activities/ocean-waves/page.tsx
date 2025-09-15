"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, ArrowLeft, Timer } from "lucide-react"
import Link from "next/link"

export default function OceanWaves() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([60])
  const [waveIntensity, setWaveIntensity] = useState([50])
  const [timer, setTimer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const timerOptions = [
    { label: "No Timer", value: null },
    { label: "5 minutes", value: 5 },
    { label: "10 minutes", value: 10 },
    { label: "20 minutes", value: 20 },
    { label: "30 minutes", value: 30 },
    { label: "60 minutes", value: 60 },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isPlaying && timeLeft && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev && prev <= 1) {
            setIsPlaying(false)
            return null
          }
          return prev ? prev - 1 : null
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, timeLeft])

  const togglePlayback = () => {
    if (!isPlaying && timer) {
      setTimeLeft(timer * 60) // Convert minutes to seconds
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getWaveAnimation = () => {
    const intensity = waveIntensity[0]
    return {
      animationDuration: `${4 - intensity / 50}s`,
      animationTimingFunction: "ease-in-out",
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/activities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Ocean Waves</CardTitle>
          <p className="text-muted-foreground">
            Relax to the rhythmic sound of ocean waves. Perfect for meditation, sleep, or stress relief.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ocean Visualization */}
          <div className="relative h-64 bg-gradient-to-b from-sky-200 to-blue-400 rounded-lg overflow-hidden">
            <div className="absolute inset-0">
              {/* Animated waves */}
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute bottom-0 w-full h-16 bg-gradient-to-t from-blue-500/60 to-transparent rounded-full ${
                    isPlaying ? "animate-pulse" : ""
                  }`}
                  style={{
                    bottom: `${i * 20}px`,
                    ...getWaveAnimation(),
                    animationDelay: `${i * 0.5}s`,
                  }}
                />
              ))}
            </div>

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                onClick={togglePlayback}
                size="lg"
                className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-blue-600"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>
            </div>

            {/* Timer display */}
            {timeLeft && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {formatTime(timeLeft)}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Volume Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Volume
              </label>
              <div className="flex items-center gap-4">
                <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
              </div>
            </div>

            {/* Wave Intensity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Wave Intensity</label>
              <div className="flex items-center gap-4">
                <Slider value={waveIntensity} onValueChange={setWaveIntensity} max={100} step={1} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12">{waveIntensity[0]}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Adjust the intensity of the wave sounds</p>
            </div>

            {/* Timer Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Sleep Timer
              </label>
              <div className="flex flex-wrap gap-2">
                {timerOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={timer === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimer(option.value)}
                    disabled={isPlaying}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={togglePlayback} size="lg">
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause Waves
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Ocean Sounds
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground border-t pt-4">
            <p>Close your eyes and imagine yourself by the ocean.</p>
            <p>Let the rhythmic waves wash away your stress and tension.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
