"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, AlertTriangle, Heart, ExternalLink, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface CrisisSupportProps {
  userId: string
}

export function CrisisSupport({ userId }: CrisisSupportProps) {
  const [recentCrisisEvents, setRecentCrisisEvents] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    loadRecentCrisisEvents()
  }, [])

  const loadRecentCrisisEvents = async () => {
    const { data } = await supabase
      .from("crisis_events")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (data) {
      setRecentCrisisEvents(data)
    }
  }

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support and suicide prevention",
      available: "24/7",
      action: () => window.open("tel:988", "_self"),
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 text-based crisis support",
      available: "24/7",
      action: () => window.open("sms:741741", "_self"),
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate medical emergencies",
      available: "24/7",
      action: () => window.open("tel:911", "_self"),
    },
  ]

  const supportResources = [
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service for mental health and substance abuse",
      website: "https://www.samhsa.gov/find-help/national-helpline",
    },
    {
      name: "National Alliance on Mental Illness (NAMI)",
      number: "1-800-950-6264",
      description: "Support, education and advocacy for mental health",
      website: "https://www.nami.org",
    },
    {
      name: "Mental Health America",
      number: "1-800-969-6642",
      description: "Mental health resources and screening tools",
      website: "https://www.mhanational.org",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Crisis Support</h1>
        <p className="text-muted-foreground text-lg">Immediate help and resources for mental health crises</p>
      </div>

      {/* Emergency Alert */}
      <Alert className="border-red-500 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>
            If you're in immediate danger or having thoughts of suicide, please call 988 or 911 immediately.
          </strong>
          <br />
          You are not alone. Professional help is available 24/7.
        </AlertDescription>
      </Alert>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-500" />
            Emergency Contacts
          </CardTitle>
          <p className="text-sm text-muted-foreground">Immediate crisis support available 24/7</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{contact.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{contact.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-mono font-medium">{contact.number}</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <Clock className="h-3 w-3" />
                    {contact.available}
                  </span>
                </div>
              </div>
              <Button onClick={contact.action} className="bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Support Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-blue-500" />
            Additional Support Resources
          </CardTitle>
          <p className="text-sm text-muted-foreground">Professional mental health support and information</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h3 className="font-semibold">{resource.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{resource.description}</p>
                <span className="font-mono text-sm">{resource.number}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.open(`tel:${resource.number.replace(/\D/g, "")}`, "_self")}
                  variant="outline"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button onClick={() => window.open(resource.website, "_blank")} variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Website
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Safety Planning */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Planning</CardTitle>
          <p className="text-sm text-muted-foreground">Create a plan to keep yourself safe during difficult times</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Warning Signs</h4>
              <p className="text-sm text-muted-foreground">
                Identify thoughts, feelings, or situations that might lead to a crisis
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Coping Strategies</h4>
              <p className="text-sm text-muted-foreground">
                List activities that help you feel better or distract from difficult thoughts
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Support Network</h4>
              <p className="text-sm text-muted-foreground">
                Friends, family, or professionals you can contact for support
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Professional Contacts</h4>
              <p className="text-sm text-muted-foreground">
                Therapists, doctors, or crisis services you can reach out to
              </p>
            </div>
          </div>
          <div className="text-center">
            <Button variant="outline">Create My Safety Plan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentCrisisEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Support Activity</CardTitle>
            <p className="text-sm text-muted-foreground">Your recent interactions with crisis support</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCrisisEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        event.crisis_level === "high"
                          ? "bg-red-100 text-red-800"
                          : event.crisis_level === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.crisis_level} level
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(event.created_at).toLocaleDateString()} at{" "}
                      {new Date(event.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
