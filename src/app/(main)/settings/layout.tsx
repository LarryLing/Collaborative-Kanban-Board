import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Settings, User } from "lucide-react";
import Link from "next/link";

export default async function GroupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<div className="flex flex-col gap-4">
				<h2 className="font-semibold text-3xl">Settings</h2>
			</div>
			<Separator className="w-full" />
			<div className="flex flex-col md:flex-row">
				<div className="flex flex-col gap-2 lg:basis-[250px] md:basis-[200px] basis-full">
					<Button
						variant="ghost"
						className={`w-full justify-start`}
						asChild
					>
						<Link href="/settings/profile">
							<User />
							<span>Profile</span>
						</Link>
					</Button>
					<Button
						variant="ghost"
						className={`w-full justify-start`}
						asChild
					>
						<Link href="/settings/account">
							<Settings />
							<span>Account</span>
						</Link>
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
}
