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
		avatar: "",
	});

	useEffect(() => {
		async function fetchUser() {
			const supabase = await createClient();
			const { data: userData } = await supabase.auth.getUser();

			if (!userData.user) redirect("/login");

			const { data: userProfile } = await supabase
				.from("profiles")
				.select("id, display_name, email, role, bio, avatar")
				.eq("id", userData.user.id)
				.single();

			setUserProfile(userProfile as UserProfile);

			if (userProfile === null) redirect("/login");
		}

		fetchUser();
	}, []);

	return { userProfile, setUserProfile };
}
