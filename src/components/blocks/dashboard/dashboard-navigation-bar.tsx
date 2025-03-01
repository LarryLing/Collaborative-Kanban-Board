"use client";

import React, { useState } from "react";
import { UserProfile } from "@/lib/types";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import AvatarPopover from "./avatar-popover";
import Branding from "../misc/branding";

export default function DashboardNavigationBar({
	id,
	display_name,
	email,
	role,
	bio,
	avatar,
}: UserProfile) {
	const [userProfile, setUserProfile] = useState<UserProfile>({
		id,
		display_name,
		email,
		role,
		bio,
		avatar,
	});
	const { theme, setTheme } = useTheme();

	return (
		<>
			<NavigationMenu className="sticky text-nowrap max-w-none w-full basis-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
				<Branding />
				<div className="flex justify-center items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() =>
							setTheme(theme === "light" ? "dark" : "light")
						}
					>
						{theme === "light" ? (
							<Sun className="size-4" />
						) : (
							<Moon className="size-4" />
						)}
					</Button>
					<AvatarPopover userProfile={userProfile} />
				</div>
			</NavigationMenu>
		</>
	);
}
