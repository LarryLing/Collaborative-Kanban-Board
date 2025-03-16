import AccountClientComponent from "@/components/blocks/settings/account-client-component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AccountPage() {
	const supabase = await createClient();
	const { data: user } = await supabase.auth.getUser();

	if (!user.user) redirect("/login");

	const { data: userProfile, error: profileError } = await supabase
		.from("profiles")
		.select("*, socials(url)")
		.eq("id", user.user.id)
		.single();

	if (profileError) throw profileError;

	return <AccountClientComponent userProfile={userProfile} />;
}
