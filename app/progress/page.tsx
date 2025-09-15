import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProgressAnalytics } from "@/components/progress/progress-analytics"

export default async function ProgressPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Get comprehensive data for analytics
  const [moodData, sessionData, activityData] = await Promise.all([
    supabase.from("mood_entries").select("*").eq("user_id", data.user.id).order("created_at", { ascending: true }),
    supabase
      .from("chat_sessions")
      .select("*, messages(*)")
      .eq("user_id", data.user.id)
      .order("created_at", { ascending: true }),
    supabase.from("activity_sessions").select("*").eq("user_id", data.user.id).order("created_at", { ascending: true }),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <DashboardHeader user={data.user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        <ProgressAnalytics
          userId={data.user.id}
          moodData={moodData.data || []}
          sessionData={sessionData.data || []}
          activityData={activityData.data || []}
        />
      </main>
    </div>
  )
}
