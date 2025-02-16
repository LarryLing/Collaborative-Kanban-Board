"use client"

import React, { useEffect, useState } from "react"
import { UserProfile } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AvatarPopover from "./avatar-popover"
import Branding from "../misc/branding"

type DashboardNavigationBarProps = {
	user: User
}

export default function DashboardNavigationBar({
	user,
}: DashboardNavigationBarProps) {
	const supabase = createClient()
	const { theme, setTheme } = useTheme()
	const [userProfile, setUserProfile] = useState<UserProfile>()

	useEffect(() => {
		async function getUserProfile(user: User) {
			let tempProfile = null

			const { data: profileData } = await supabase
				.from("profiles")
				.select("id, display_name, email, role, bio, avatar")
				.eq("id", user.id)
				.single()

			tempProfile = profileData as UserProfile

			if (profileData && profileData.avatar) {
				const { data: avatarUrl } = await supabase.storage
					.from("avatars")
					.getPublicUrl(profileData.avatar)
				tempProfile.avatar = avatarUrl.publicUrl
			}

			setUserProfile(tempProfile)
		}

		getUserProfile(user)
	}, [user, supabase])

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
					<AvatarPopover userProfile={userProfile!} />
				</div>
			</NavigationMenu>
		</>
	)
}
