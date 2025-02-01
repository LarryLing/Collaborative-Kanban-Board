import Branding from "@/components/blocks/misc/branding"
import { BrillianceIcon } from "@/components/icons/icon"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import Link from "next/link"

export default async function AuthenticationLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<section className="relative">
			<div className="absolute top-0 left-0 w-full h-[80px] px-4 py-5 border-b-[1px] border-transparent">
				<div className="flex justify-between items-center size-full">
					<Branding />
					<Link href="/">
						<Button>Return Home</Button>
					</Link>
				</div>
			</div>
			{children}
		</section>
	)
}
