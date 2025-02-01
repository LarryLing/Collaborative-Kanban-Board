import { LoginForm } from "@/components/blocks/authentication/login-form"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage() {
	const supabase = await createClient()

	const { data } = await supabase.auth.getUser()
	if (data.user) {
		redirect("/")
	}

	return (
		<div className="flex justify-start h-screen">
			<LoginForm />
		</div>
	)
}
