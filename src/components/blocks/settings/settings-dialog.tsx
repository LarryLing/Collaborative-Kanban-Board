"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import ProfileSettings from "./profile-settings";
import AccountSettings from "./account-settings";
import AppearanceSettings from "./appearance-settings";

type SettingsDialogProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
	isSettingsDialogOpen: boolean;
	setIsSettingsDialogOpen: (arg0: boolean) => void;
};

type Tabs = "Profile" | "Account" | "Password" | "Appearance" | "Danger Zone";

export default function SettingsDialog({
	userProfile,
	setUserProfile,
	isSettingsDialogOpen,
	setIsSettingsDialogOpen,
}: SettingsDialogProps) {
	const [currentTab, setCurrentTab] = useState<Tabs>("Profile");

	return (
		<Dialog
			open={isSettingsDialogOpen}
			onOpenChange={setIsSettingsDialogOpen}
		>
			<DialogContent className="max-w-[1024px] max-h-[800px] overflow-y-auto gap-6">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
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
							className={`justify-start ${currentTab === "Password" ? "bg-accent" : ""}`}
							onClick={() => setCurrentTab("Password")}
						>
							Password
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
			</DialogContent>
		</Dialog>
	);
}
