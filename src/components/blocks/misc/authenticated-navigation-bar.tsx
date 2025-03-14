"use client";

import React from "react";
import { UserProfile } from "@/lib/types";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import AvatarPopover from "./avatar-popover";
import Branding from "./branding";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

type AuthenticatedNavigationBarProps = {
	userProfile: UserProfile;
};

export default function AuthenticatedNavigationBar({
	userProfile,
}: AuthenticatedNavigationBarProps) {
	const { theme, setTheme } = useTheme();

	return (
		<NavigationMenu className="sticky text-nowrap max-w-none w-full basis-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
			<Branding />
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
				<AvatarPopover userProfile={userProfile} />
			</div>
		</NavigationMenu>
	);
}
