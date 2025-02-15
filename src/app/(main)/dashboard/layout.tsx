import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardNavigationBar from "@/components/blocks/dashboard/dashboard-navigation-bar"

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const supabase = await createClient()
	const { data: userData } = await supabase.auth.getUser()

	if (!userData.user) redirect("/login")

	return (
		<section className="flex flex-col justify-center items-center">
			<DashboardNavigationBar user={userData.user} />
			{children}
		</section>
	)
}
