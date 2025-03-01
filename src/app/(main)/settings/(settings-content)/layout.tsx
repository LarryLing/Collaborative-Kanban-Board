"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex">
			<div className="flex flex-col gap-2 basis-[300px]">
				<Button variant="ghost" className={`justify-start`} asChild>
					<Link href="/settings/profile">Profile</Link>
				</Button>
				<Button variant="ghost" className={`justify-start`} asChild>
					<Link href="/settings/account">Account</Link>
				</Button>
				<Button variant="ghost" className={`justify-start`} asChild>
					<Link href="/settings/appearance">Appearance</Link>
				</Button>
			</div>
			<div className="w-full">{children}</div>
		</section>
	);
}
