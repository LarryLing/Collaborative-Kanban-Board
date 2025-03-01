"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ProfileSettings from "./profile-settings";
import AccountSettings from "./account-settings";
import AppearanceSettings from "./appearance-settings";
import { UserProfile } from "@/lib/types";

type Tabs = "Profile" | "Account" | "Password" | "Appearance" | "Danger Zone";

type SettingsProps = {
	userProfile: UserProfile;
};

export default function Settings({ userProfile }: SettingsProps) {
	const [currentTab, setCurrentTab] = useState<Tabs>("Profile");

	return (
		<div className="flex">
			<div className="flex flex-col gap-2 basis-[300px]">
				<Button
					variant="ghost"
					className={`justify-start ${currentTab === "Profile" ? "bg-accent" : ""}`}
					onClick={() => setCurrentTab("Profile")}
				>
					Profile
				</Button>
				<Button
					variant="ghost"
					className={`justify-start ${currentTab === "Account" ? "bg-accent" : ""}`}
					onClick={() => setCurrentTab("Account")}
				>
					Account
				</Button>
				<Button
					variant="ghost"
					className={`justify-start ${currentTab === "Appearance" ? "bg-accent" : ""}`}
					onClick={() => setCurrentTab("Appearance")}
				>
					Appearance
				</Button>
			</div>
			<div className="w-full">
				{currentTab === "Profile" && (
					<ProfileSettings userProfile={userProfile} />
				)}
				{currentTab === "Account" && (
					<AccountSettings userProfile={userProfile} />
				)}
				{currentTab === "Appearance" && <AppearanceSettings />}
			</div>
		</div>
	);
}
