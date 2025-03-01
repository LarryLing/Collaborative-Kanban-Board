import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@/lib/types";
import DashboardNavigationBar from "@/components/blocks/dashboard/dashboard-navigation-bar";
import { Separator } from "@/components/ui/separator";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = await createClient();
	const { data: userData } = await supabase.auth.getUser();

	if (!userData.user) redirect("/login");

	const { data: userProfile } = await supabase
		.from("profiles")
		.select("id, display_name, email, role, bio, avatar")
		.eq("id", userData.user.id)
		.single();

	return (
		<section className="flex flex-col justify-center items-center">
			<DashboardNavigationBar userProfile={userProfile as UserProfile} />
			<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
				<div className="flex flex-col gap-4">
					<h2 className="font-semibold text-3xl">Settings</h2>
				</div>
				<Separator className="w-full" />
				{children}
			</div>
		</section>
	);
}
