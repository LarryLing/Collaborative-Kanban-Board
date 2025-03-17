"use client";

import React from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { BrillianceIcon } from "@/components/icons/icon";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function NavigationBar({ user }: { user: User | null }) {
	const { theme, setTheme } = useTheme();

	return (
		<NavigationMenu className="sticky text-nowrap max-w-none w-full h-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
			<Link
				href="/"
				className="flex item-center font-bold text-2xl gap-3"
			>
				<BrillianceIcon />
				<span className="hidden sm:inline">Kanban Board</span>
			</Link>
			<div className="flex justify-center items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					onClick={() =>
						setTheme(theme === "dark" ? "light" : "dark")
					}
				>
					{theme === "dark" ? (
						<Sun className="size-4" />
					) : (
						<Moon className="size-4" />
					)}
				</Button>
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
