"use client";

import AuthenticatedNavigationBar from "@/components/blocks/misc/authenticated-navigation-bar";
import AccountSettings from "@/components/blocks/settings/account-settings";
import ProfileSettings from "@/components/blocks/settings/profile-settings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useClientUser } from "@/hooks/use-client-user";
import { useToast } from "@/hooks/use-toast";
import { Settings, User } from "lucide-react";
import React, { useState } from "react";

export default function ProfileSettingsPage() {
	const { userProfile, setUserProfile } = useClientUser();
	const [activeTab, setActiveTab] = useState<"profile" | "account">(
		"profile",
	);
	const { toast } = useToast();

	return (
		<div className="flex flex-col justify-center items-center">
			<AuthenticatedNavigationBar userProfile={userProfile} />
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
							setUserProfile={setUserProfile}
							toast={toast}
						/>
					)}
					{activeTab === "account" && (
						<AccountSettings
							userProfile={userProfile}
							setUserProfile={setUserProfile}
							toast={toast}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
