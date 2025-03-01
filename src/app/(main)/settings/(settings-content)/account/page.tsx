import AccountSettings from "@/components/blocks/settings/account-settings";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";

export default async function AccountSettingsPage() {
	const supabase = await createClient();
	const { data: userData } = await supabase.auth.getUser();

	if (!userData.user) redirect("/login");

	const { data: userProfile } = await supabase
		.from("profiles")
		.select("id, display_name, email, role, bio, avatar")
		.eq("id", userData.user.id)
		.single();

	return <AccountSettings userProfile={userProfile as UserProfile} />;
}
