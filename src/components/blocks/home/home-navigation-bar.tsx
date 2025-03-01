"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserProfile } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { BrillianceIcon } from "@/components/icons/icon";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Branding from "../misc/branding";

type HomeNavigationBarProps = {
	user: User | null;
};

export default function NavigationBar({ user }: HomeNavigationBarProps) {
	const supabase = createClient();
	const { theme, setTheme } = useTheme();
	const [userProfile, setUserProfile] = useState<UserProfile | null>();

	useEffect(() => {
		async function getUserProfile(user: User | null) {
			if (!user) {
				setUserProfile(null);
				return;
			}

			let tempProfile = null;

			const { data: profileData } = await supabase
				.from("profiles")
				.select("id, display_name, email, role, bio, avatar")
				.eq("id", user.id)
				.single();

			tempProfile = profileData as UserProfile;

			if (profileData && profileData.avatar) {
				const { data: avatarUrl } = await supabase.storage
					.from("avatars")
					.getPublicUrl(profileData.avatar);
				tempProfile.avatar = avatarUrl.publicUrl;
			}

			setUserProfile(tempProfile);
		}

		getUserProfile(user);
	}, [user, supabase]);

	return (
		<NavigationMenu className="sticky text-nowrap max-w-none w-full h-[80px] px-4 flex justify-between items-center border-b-[1px] border-border">
			<Link
				href="/"
				className="flex item-center font-bold text-2xl gap-3"
			>
				<BrillianceIcon />
				<span className="hidden sm:inline">Kanban Board</span>
			</Link>
			<div className="flex justify-center items-center gap-4">
				{userProfile ? (
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
