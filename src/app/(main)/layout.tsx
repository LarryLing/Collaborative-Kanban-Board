import AuthenticatedNavigationBar from "@/components/blocks/misc/authenticated-navigation-bar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GroupLayout({ children }: { children: React.ReactNode }) {
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
			<AuthenticatedNavigationBar
				userProfile={userProfile}
				publicUrl={publicUrl.publicUrl}
			/>
			{children}
		</div>
	);
}
