import React from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";
import Branding from "./branding";

export default function NavigationBar({ user }: { user: User | null }) {
	return (
		<NavigationMenu className="sticky text-nowrap max-w-none w-full h-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
			<Branding href="/" />
			<div className="flex justify-center items-center gap-2">
				<ThemeToggle />
				{user ? (
					<Link href="/dashboard">
						<Button>Dashboard</Button>
					</Link>
				) : (
					<>
						<Link href="/login">
							<Button variant="link">Login</Button>
						</Link>
						<Link href="/signup">
							<Button>Sign Up</Button>
						</Link>
					</>
				)}
			</div>
		</NavigationMenu>
	);
}
