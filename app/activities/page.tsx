import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Wind, TreePine, Heart, Waves } from "lucide-react"
import Link from "next/link"

export default async function ActivitiesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  const activities = [
    {
      id: "breathing",
      title: "Breathing Exercise",
      description: "Guided breathing techniques to reduce anxiety and promote relaxation",
      icon: Wind,
      color: "bg-blue-500/10 text-blue-600",
      href: "/activities/breathing",
    },
    {
      id: "zen-garden",
      title: "Zen Garden",
      description: "Interactive sand patterns for mindfulness and stress relief",
      icon: Heart,
      color: "bg-green-500/10 text-green-600",
      href: "/activities/zen-garden",
    },
    {
      id: "forest-walk",
      title: "Forest Walk",
      description: "Immersive nature sounds and visualization for mental clarity",
      icon: TreePine,
      color: "bg-emerald-500/10 text-emerald-600",
      href: "/activities/forest-walk",
    },
    {
      id: "ocean-waves",
      title: "Ocean Waves",
      description: "Calming ocean sounds for deep relaxation and sleep",
      icon: Waves,
      color: "bg-cyan-500/10 text-cyan-600",
      href: "/activities/ocean-waves",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader user={data.user} profile={profile} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Therapeutic Activities</h1>
            <p className="text-muted-foreground text-lg">
              Interactive exercises designed to promote mindfulness, reduce stress, and improve mental well-being
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((activity) => (
              <Link key={activity.id} href={activity.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${activity.color} flex items-center justify-center mb-4`}>
                      <activity.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Click to start this activity</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
