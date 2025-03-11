"use client";

import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function useClientUser() {
	const [userProfile, setUserProfile] = useState<UserProfile>({
		id: "",
		display_name: "",
		email: "",
		role: "",
		bio: "",
		avatarUrl: "",
	});

	useEffect(() => {
		async function fetchUser() {
			const supabase = await createClient();
			const { data: user } = await supabase.auth.getUser();

			if (!user.user) redirect("/login");

			const { data: profile } = await supabase
				.from("profiles")
				.select("id, display_name, email, role, bio, avatar")
				.eq("id", user.user.id)
				.single();

			const userProfile: UserProfile = {
				id: profile?.id,
				display_name: profile?.display_name,
				email: profile?.email,
				role: profile?.role,
				bio: profile?.bio,
				avatarUrl: "",
			};

			if (profile && profile.avatar) {
				const supabase = await createClient();
				const { data: publicUrl } = await supabase.storage
					.from("avatars")
					.getPublicUrl(profile.avatar);

				userProfile.avatarUrl = publicUrl.publicUrl;
			}

			setUserProfile(userProfile as UserProfile);

			if (userProfile === null)
				throw new Error("could not fetch user data");
		}

		fetchUser();
	}, []);

	return { userProfile, setUserProfile };
}
