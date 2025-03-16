import SettingsClientComponent from "@/components/blocks/settings/settings-client-component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfileSettingsPage() {
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
		<div className="flex flex-col justify-center items-center">
			<SettingsClientComponent userProfile={userProfile} publicUrl={publicUrl.publicUrl} />
		</div>
	);
}
