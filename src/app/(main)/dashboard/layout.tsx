import DashboardNavigationBar from "@/components/blocks/dashboard/dashboard-navigation-bar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const supabase = await createClient()
	const { data: userData } = await supabase.auth.getUser()

	if (!userData.user) redirect("/login")

	return (
		<section>
			<DashboardNavigationBar user={userData.user} />
			<div className="w-full py-4 px-8 flex flex-col justify-center items-center">
				{children}
			</div>
		</section>
	)
}
