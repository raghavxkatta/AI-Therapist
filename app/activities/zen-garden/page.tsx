"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Palette } from "lucide-react"
import Link from "next/link"

export default function ZenGarden() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [pattern, setPattern] = useState<"lines" | "circles" | "waves">("lines")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Fill with sand color
    ctx.fillStyle = "#f4f1e8"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add subtle texture
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(139, 125, 107, ${Math.random() * 0.1})`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.globalCompositeOperation = "multiply"
    ctx.strokeStyle = "#8b7d6b"
    ctx.lineWidth = brushSize
    ctx.lineCap = "round"

    if (pattern === "lines") {
      ctx.beginPath()
      ctx.moveTo(x - brushSize / 2, y)
      ctx.lineTo(x + brushSize / 2, y)
      ctx.stroke()
    } else if (pattern === "circles") {
      ctx.beginPath()
      ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (pattern === "waves") {
      ctx.beginPath()
      for (let i = -brushSize; i <= brushSize; i += 2) {
        const waveY = y + Math.sin(i * 0.2) * 5
        if (i === -brushSize) {
          ctx.moveTo(x + i, waveY)
        } else {
          ctx.lineTo(x + i, waveY)
        }
      }
      ctx.stroke()
    }
  }

  const clearGarden = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Reset to sand color
    ctx.fillStyle = "#f4f1e8"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add subtle texture
    for (let i = 0; i < 1000; i++) {
      ctx.fillStyle = `rgba(139, 125, 107, ${Math.random() * 0.1})`
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1)
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
          <CardTitle className="text-2xl">Zen Garden</CardTitle>
          <p className="text-muted-foreground">
            Create peaceful patterns in the sand. Let your mind focus on the present moment.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="text-sm font-medium">Pattern:</span>
              {["lines", "circles", "waves"].map((p) => (
                <Button
                  key={p}
                  variant={pattern === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPattern(p as any)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Size:</span>
              {[10, 20, 30].map((size) => (
                <Button
                  key={size}
                  variant={brushSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setBrushSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>

            <Button onClick={clearGarden} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          {/* Canvas */}
          <div className="border-2 border-muted rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full h-96 cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Click and drag to create patterns in the sand.</p>
            <p>Focus on your breathing and let your creativity flow.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
