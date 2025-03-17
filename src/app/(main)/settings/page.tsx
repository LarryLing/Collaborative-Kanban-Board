import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { Settings, User } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileSettings from "@/components/blocks/settings/profile-settings";
import AccountSettings from "@/components/blocks/settings/account-settings";

export default async function SettingsPage(props: {
	searchParams?: Promise<{
		tab?: string;
	}>;
}) {
	const searchParams = await props.searchParams;
	const tab = searchParams?.tab || "";

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
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<div className="flex flex-col gap-4">
				<h2 className="font-semibold text-3xl">Settings</h2>
			</div>
			<Separator className="w-full" />
			<div className="flex flex-col md:flex-row">
				<div className="flex flex-col gap-2 lg:basis-[250px] md:basis-[200px] basis-full">
					<Button
						variant="ghost"
						className={`w-full ${tab === "" ? "bg-accent" : ""} justify-start`}
						asChild
					>
						<Link href="/settings">
							<User />
							<span>Profile</span>
						</Link>
					</Button>
					<Button
						variant="ghost"
						className={`w-full ${tab === "account" ? "bg-accent" : ""} justify-start`}
						asChild
					>
						<Link href="/settings/?tab=account">
							<Settings />
							<span>Account</span>
						</Link>
					</Button>
				</div>
				{tab === "" && (
					<ProfileSettings
						userProfile={userProfile}
						publicUrl={publicUrl.publicUrl}
					/>
				)}
				{tab === "account" && (
					<AccountSettings userProfile={userProfile} />
				)}
			</div>
		</div>
	);
}
