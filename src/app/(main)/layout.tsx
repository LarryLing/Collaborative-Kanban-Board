import AuthenticatedNavigationBar from "@/components/blocks/misc/authenticated-navigation-bar";
import { selectProfileByProfileId } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GroupLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient();

	const { data: user } = await supabase.auth.getUser();

	if (!user.user) redirect("/login");

	const { data: userProfile, error: profileError } = await selectProfileByProfileId(
		supabase,
		user.user.id,
	);

	if (profileError) throw profileError;

	return (
		<div className="flex flex-col justify-center items-center">
			<AuthenticatedNavigationBar userProfile={userProfile} />
			{children}
		</div>
	);
}
