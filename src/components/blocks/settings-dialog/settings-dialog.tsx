"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import EditProfileCard from "./edit-profile-card";
import UpdateEmailCard from "./update-email-card";
import ChangePasswordCard from "./change-password-card";
import DeleteAccountCard from "./delete-account-card";
import { UserProfile } from "@/lib/types";
import UploadAvatarCard from "./upload-avatar-card";
import { Button } from "@/components/ui/button";

type SettingsDialogProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
	isSettingsDialogOpen: boolean;
	setIsSettingsDialogOpen: (arg0: boolean) => void;
};

type Tabs = "Profile" | "Account" | "Appearance" | "Danger Zone";

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
			<DialogContent className="max-w-[1024px] max-h-[600px] overflow-y-auto gap-6">
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
							className={`justify-start ${currentTab === "Appearance" ? "bg-accent" : ""}`}
							onClick={() => setCurrentTab("Appearance")}
						>
							Appearance
						</Button>
						<Button
							variant="ghost"
							className={`justify-start ${currentTab === "Danger Zone" ? "bg-accent" : ""}`}
							onClick={() => setCurrentTab("Danger Zone")}
						>
							Danger Zone
						</Button>
					</div>
					<div className="w-full">
						{currentTab === "Profile" && (
							<EditProfileCard userProfile={userProfile} />
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
