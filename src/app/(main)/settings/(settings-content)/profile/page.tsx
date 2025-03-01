import ProfileSettings from "@/components/blocks/settings/profile-settings";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfileSettingsPage() {
	const supabase = await createClient();
	const { data: userData } = await supabase.auth.getUser();

	if (!userData.user) redirect("/login");

	const { data: userProfile } = await supabase
		.from("profiles")
		.select("id, display_name, email, role, bio, avatar")
		.eq("id", userData.user.id)
		.single();

	return <ProfileSettings userProfile={userProfile as UserProfile} />;
}
