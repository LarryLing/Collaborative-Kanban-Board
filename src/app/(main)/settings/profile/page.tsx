import ProfileClientComponent from "@/components/blocks/settings/profile-client-component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfilePage() {
	const supabase = await createClient();
	const { data: user } = await supabase.auth.getUser();

	if (!user.user) redirect("/login");

	const { data: userProfile, error: profileError } = await supabase
		.from("profiles")
		.select("*, socials(url)")
		.eq("id", user.user.id)
		.single();

	if (profileError) throw profileError;

	const { data: publicUrl } = await supabase.storage
		.from("avatars")
		.getPublicUrl(userProfile.avatar_path || "");

	return (
		<ProfileClientComponent
			userProfile={userProfile}
			publicUrl={publicUrl.publicUrl}
		/>
	);
}
