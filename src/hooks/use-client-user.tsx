"use client";

import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export function useClientUser() {
	const [userProfile, setUserProfile] = useState<UserProfile>({
		id: "",
		displayName: "",
		email: "",
		aboutMe: "",
		socials: [],
	});

	useEffect(() => {
		async function fetchUser() {
			const supabase = await createClient();
			const { data: user } = await supabase.auth.getUser();

			if (!user.user) redirect("/login");

			const { data: profileData, error: profileError } = await supabase
				.from("profiles")
				.select()
				.eq("id", user.user.id)
				.single();

			if (profileError) throw profileError;

			const { data: socialsData, error: socialsError } = await supabase
				.from("socials")
				.select("url")
				.eq("profile_id", user.user.id);

			if (socialsError) throw socialsError;

			// const socials = [];
			// const socialsDataLength = socialsData.length;
			// for (let i = 0; i < 4; i++) {
			// 	if (i < socialsDataLength) {
			// 		socials.push(new URL(socialsData[i].url));
			// 	} else {
			// 		socials.push(undefined);
			// 	}
			// }

			let avatarUrl;
			if (profileData && profileData.avatar_path) {
				const supabase = await createClient();
				const { data: publicUrl } = await supabase.storage
					.from("avatars")
					.getPublicUrl(profileData.avatar_path);

				avatarUrl = publicUrl.publicUrl;
			}

			const userProfile: UserProfile = {
				id: user.user.id,
				displayName: profileData.display_name,
				email: profileData.email,
				aboutMe: profileData.about_me,
				avatarUrl: avatarUrl,
				socials: socialsData.map((social) => social.url),
			};

			setUserProfile(userProfile as UserProfile);

			if (userProfile === null)
				throw new Error("could not fetch user data");
		}

		fetchUser();
	}, []);

	return { userProfile, setUserProfile };
}
