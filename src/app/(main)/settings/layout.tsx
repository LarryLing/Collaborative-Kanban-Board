import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@/lib/types";
import DashboardNavigationBar from "@/components/blocks/dashboard/dashboard-navigation-bar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) redirect("/login");

    const { data: userProfile } = await supabase
        .from("profiles")
        .select("id, display_name, email, role, bio, avatar")
        .eq("id", userData.user.id)
        .single();

    return (
        <section className="flex flex-col justify-center items-center">
            <DashboardNavigationBar {...(userProfile as UserProfile)} />
            {children}
        </section>
    );
}
