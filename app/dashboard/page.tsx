import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        redirect("/auth/signin");
    }

    // Get user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", data.user.id)
        .single();

    const displayName = profile?.display_name || data.user.email?.split("@")[0] || "User";

    // Render the Client Component and pass the fetched data as props
    return (
        <DashboardContent userId={data.user.id} displayName={displayName} />
    );
}