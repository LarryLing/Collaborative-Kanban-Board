import AppearanceSettings from "@/components/blocks/settings/appearance-settings";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function AppearanceSettingsPage() {
	const supabase = await createClient();
	const { data: userData } = await supabase.auth.getUser();

	if (!userData.user) redirect("/login");

	return <AppearanceSettings />;
}
