import DashboardNavigationBar from "@/components/blocks/dashboard/dashboard-navigation-bar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import React from "react"

export default async function Item1Page() {
	const supabase = await createClient()
	const { data: userData } = await supabase.auth.getUser()

	if (!userData.user) redirect("/login")

	return (
		<div>
			<DashboardNavigationBar user={userData.user} />
		</div>
	)
}
