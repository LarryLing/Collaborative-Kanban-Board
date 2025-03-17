"use client";

import React from "react";
import { UserProfile } from "@/lib/types";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import AvatarPopover from "./avatar-popover";
import Branding from "./branding";
import ThemeToggle from "./theme-toggle";

type AuthenticatedNavigationBarProps = {
	userProfile: UserProfile;
	publicUrl: string;
};

export default function AuthenticatedNavigationBar({
	userProfile,
	publicUrl,
}: AuthenticatedNavigationBarProps) {
	return (
		<NavigationMenu className="sticky text-nowrap max-w-none w-full basis-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
			<Branding href="/dashboard" />
			<div className="flex justify-center items-center gap-2">
				<ThemeToggle />
				<AvatarPopover
					userProfile={userProfile}
					publicUrl={publicUrl}
				/>
			</div>
		</NavigationMenu>
	);
}
