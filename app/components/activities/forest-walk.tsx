"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function ForestWalk() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([70])
  const [currentScene, setCurrentScene] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scenes = [
    {
      title: "Morning Forest",
      description: "Gentle bird songs and rustling leaves in the early morning light",
      image: "/peaceful-morning-forest-with-sunlight.jpg",
      sounds: ["birds", "leaves", "gentle wind"],
    },
    {
      title: "Forest Stream",
      description: "The soothing sound of water flowing over rocks",
      image: "/forest-stream-with-rocks-and-moss.jpg",
      sounds: ["water", "birds", "nature"],
    },
    {
      title: "Deep Woods",
      description: "Immerse yourself in the heart of an ancient forest",
      image: "/deep-forest-with-tall-trees-and-filtered-light.jpg",
      sounds: ["wind", "leaves", "distant birds"],
    },
  ]

  useEffect(() => {
    // Simulate audio setup
    audioRef.current = new Audio()
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    // In a real implementation, this would control actual audio playback
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
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
          <CardTitle className="text-2xl">Forest Walk</CardTitle>
          <p className="text-muted-foreground">
            Take a virtual walk through peaceful forest environments. Close your eyes and let the sounds transport you.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scene Selection */}
          <div className="grid md:grid-cols-3 gap-4">
            {scenes.map((scene, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  currentScene === index ? "ring-2 ring-primary" : "hover:shadow-md"
                }`}
                onClick={() => setCurrentScene(index)}
              >
                <CardContent className="p-4">
                  <img
                    src={scene.image || "/placeholder.svg"}
                    alt={scene.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                  <h3 className="font-medium mb-1">{scene.title}</h3>
                  <p className="text-xs text-muted-foreground">{scene.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Scene Display */}
          <div className="text-center space-y-4">
            <div className="relative">
              <img
                src={scenes[currentScene].image || "/placeholder.svg"}
                alt={scenes[currentScene].title}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                <Button
                  onClick={togglePlayback}
                  size="lg"
                  className="h-16 w-16 rounded-full bg-white/90 hover:bg-white text-black"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">{scenes[currentScene].title}</h2>
              <p className="text-muted-foreground">{scenes[currentScene].description}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Volume2 className="h-5 w-5 text-muted-foreground" />
              <Slider value={volume} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
              <span className="text-sm text-muted-foreground w-12">{volume[0]}%</span>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={togglePlayback} size="lg">
                {isPlaying ? (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Start Journey
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sound Elements */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Current Sounds:</h3>
            <div className="flex flex-wrap gap-2">
              {scenes[currentScene].sounds.map((sound, index) => (
                <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground capitalize">
                  {sound}
                </span>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Find a comfortable position, close your eyes, and let the forest sounds guide your meditation.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
