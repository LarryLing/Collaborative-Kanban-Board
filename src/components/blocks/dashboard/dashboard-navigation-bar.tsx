"use client";

import React, { useState } from "react";
import { UserProfile } from "@/lib/types";
import { NavigationMenu } from "@/components/ui/navigation-menu";
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

	return (
		<>
			<NavigationMenu className="sticky text-nowrap max-w-none w-full basis-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
				<Branding />
				<AvatarPopover userProfile={userProfile} />
			</NavigationMenu>
		</>
	);
}
