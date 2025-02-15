import Branding from "@/components/blocks/misc/branding"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AuthenticationLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const supabase = await createClient()

	const { data } = await supabase.auth.getUser()
	if (data.user) {
		redirect("/")
	}

	return (
		<section className="relative">
			<div className="absolute top-0 left-0 w-full h-[80px] px-4 border-b-[1px] border-transparent">
				<div className="flex justify-between items-center size-full">
					<Branding />
				</div>
			</div>
			{children}
		</section>
	)
}
