"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Phone, MessageCircle, X, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CrisisAlertProps {
  level: "low" | "medium" | "high"
  onClose: () => void
  userId: string
}

export function CrisisAlert({ level, onClose, userId }: CrisisAlertProps) {
  const [showResources, setShowResources] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const getAlertConfig = () => {
    switch (level) {
      case "high":
        return {
          title: "Immediate Support Needed",
          description: "I'm concerned about your safety. Please reach out for immediate help.",
          color: "destructive" as const,
          icon: AlertTriangle,
          urgent: true,
        }
      case "medium":
        return {
          title: "Support Available",
          description: "It sounds like you're going through a difficult time. Help is available.",
          color: "default" as const,
          icon: MessageCircle,
          urgent: false,
        }
      case "low":
        return {
          title: "We're Here for You",
          description: "I notice you might be struggling. Remember that support is always available.",
          color: "default" as const,
          icon: MessageCircle,
          urgent: false,
        }
    }
  }

  const config = getAlertConfig()

  const logCrisisResponse = async (action: string) => {
    setIsLoading(true)
    try {
      await supabase.from("crisis_responses").insert({
        user_id: userId,
        crisis_level: level,
        action_taken: action,
      })
    } catch (error) {
      console.error("Error logging crisis response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmergencyCall = async () => {
    await logCrisisResponse("emergency_call_initiated")
    window.open("tel:988", "_self") // National Suicide Prevention Lifeline
  }

  const handleCrisisText = async () => {
    await logCrisisResponse("crisis_text_initiated")
    window.open("sms:741741", "_self") // Crisis Text Line
  }

  const emergencyResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support",
      action: () => window.open("tel:988", "_self"),
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text-based crisis support",
      action: () => window.open("sms:741741", "_self"),
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate medical emergencies",
      action: () => window.open("tel:911", "_self"),
    },
  ]

  const supportResources = [
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      action: () => window.open("tel:18006624357", "_self"),
    },
    {
      name: "National Alliance on Mental Illness",
      number: "1-800-950-6264",
      description: "Support and information",
      action: () => window.open("tel:18009506264", "_self"),
    },
  ]

  return (
    <>
      <Alert className={`mb-4 ${config.color === "destructive" ? "border-red-500 bg-red-50" : ""}`}>
        <config.icon className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <strong>{config.title}</strong>
            <p className="mt-1">{config.description}</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {config.urgent && (
              <>
                <Button size="sm" variant="destructive" onClick={handleEmergencyCall}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call 988
                </Button>
                <Button size="sm" variant="outline" onClick={handleCrisisText}>
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Text
                </Button>
              </>
            )}
            <Button size="sm" variant="outline" onClick={() => setShowResources(true)}>
              Resources
            </Button>
            <Button size="sm" variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <Dialog open={showResources} onOpenChange={setShowResources}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crisis Support Resources</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {level === "high" && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Immediate Help
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {emergencyResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <h4 className="font-medium">{resource.name}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <p className="text-sm font-mono">{resource.number}</p>
                      </div>
                      <Button onClick={resource.action} size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Additional Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {supportResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <p className="text-sm font-mono">{resource.number}</p>
                    </div>
                    <Button onClick={resource.action} variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">Crisis Text Line</h4>
                    <p className="text-sm text-muted-foreground">24/7 text-based crisis support</p>
                  </div>
                  <Button
                    onClick={() => window.open("https://www.crisistextline.org", "_blank")}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <h4 className="font-medium">National Suicide Prevention Lifeline</h4>
                    <p className="text-sm text-muted-foreground">Resources and chat support</p>
                  </div>
                  <Button
                    onClick={() => window.open("https://suicidepreventionlifeline.org", "_blank")}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
              <p>Remember: You are not alone. Professional help is available 24/7.</p>
              <p>If you&apos;re in immediate danger, please call 911 or go to your nearest emergency room.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
