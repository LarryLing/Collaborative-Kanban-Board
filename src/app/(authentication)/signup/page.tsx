import { SignupForm } from "@/components/blocks/authentication/signup-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import React from "react"

export default async function SignupPage() {
	const supabase = await createClient()

	const { data } = await supabase.auth.getUser()
	if (data.user) {
		redirect("/")
	}

	return (
		<div className="flex justify-start h-screen">
			<SignupForm />
		</div>
	)
}
