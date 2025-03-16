"use client";

import AuthenticatedNavigationBar from "@/components/blocks/misc/authenticated-navigation-bar";
import AccountSettings from "@/components/blocks/settings/account-settings";
import ProfileSettings from "@/components/blocks/settings/profile-settings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { UserProfile } from "@/lib/types";
import { Settings, User } from "lucide-react";
import React, { useState } from "react";

type SettingsClientComponentProps = {
	userProfile: UserProfile;
	publicUrl: string;
};

export default function SettingsClientComponent({
	userProfile,
	publicUrl,
}: SettingsClientComponentProps) {
	const [activeTab, setActiveTab] = useState<"profile" | "account">(
		"profile",
	);
	const { toast } = useToast();

	return (
		<>
			<AuthenticatedNavigationBar
				userProfile={userProfile}
				publicUrl={publicUrl}
			/>
			<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
				<div className="flex flex-col gap-4">
					<h2 className="font-semibold text-3xl">Settings</h2>
				</div>
				<Separator className="w-full" />
				<div className="flex flex-col md:flex-row">
					<div className="flex flex-col gap-2 lg:basis-[250px] md:basis-[200px] basis-full">
						<Button
							variant="ghost"
							className={`w-full justify-start  ${activeTab === "profile" ? "bg-accent" : ""}`}
							onClick={() => setActiveTab("profile")}
						>
							<User />
							<span>Profile</span>
						</Button>
						<Button
							variant="ghost"
							className={`w-full justify-start ${activeTab === "account" ? "bg-accent" : ""}`}
							onClick={() => setActiveTab("account")}
						>
							<Settings />
							<span>Account</span>
						</Button>
					</div>
					{activeTab === "profile" && (
						<ProfileSettings
							userProfile={userProfile}
							publicUrl={publicUrl}
							toast={toast}
						/>
					)}
					{activeTab === "account" && (
						<AccountSettings
							userProfile={userProfile}
							toast={toast}
						/>
					)}
				</div>
			</div>
		</>
	);
}
