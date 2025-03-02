"use client";

import { Button } from "@/components/ui/button";
import { Brush, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<section className="flex flex-col md:flex-row">
			<div className="flex flex-col gap-2 lg:basis-[250px] md:basis-[200px] basis-full">
				<Link href="/settings/profile">
					<Button
						variant="ghost"
						className={`w-full justify-start  ${pathname === "/settings/profile" ? "bg-accent" : ""}`}
					>
						<User />
						<span>Profile</span>
					</Button>
				</Link>
				<Link href="/settings/account">
					<Button
						variant="ghost"
						className={`w-full justify-start ${pathname === "/settings/account" ? "bg-accent" : ""}`}
					>
						<Settings />
						<span>Account</span>
					</Button>
				</Link>
				<Link href="/settings/appearance">
					<Button
						variant="ghost"
						className={`w-full justify-start ${pathname === "/settings/appearance" ? "bg-accent" : ""}`}
					>
						<Brush />
						<span>Appearance</span>
					</Button>
				</Link>
			</div>
			{children}
		</section>
	);
}
