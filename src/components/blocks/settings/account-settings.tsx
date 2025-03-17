"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { UserProfile } from "@/lib/types";
import DeleteAccountDialog from "./delete-account-dialog";
import UpdateEmailDialog from "./update-email-dialog";
import UpdatePasswordDialog from "./update-password-dialog";
import { useToast } from "@/hooks/use-toast";

export default function AccountSettings({
	userProfile,
}: {
	userProfile: UserProfile;
}) {
	const { toast } = useToast();

	const [isAccountDeleteDialogOpen, setIsAccountDeleteDialogOpen] =
		useState(false);
	const [isUpdateEmailDialogOpen, setIsUpdateEmailDialogOpen] =
		useState(false);
	const [isUpdatePasswordDialogOpen, setIsUpdatePasswordIsDialogOpen] =
		useState(false);

	return (
		<>
			<Card className="border-none shadow-none flex-auto">
				<CardHeader className="md:pt-0">
					<CardTitle>Account</CardTitle>
					<CardDescription>
						Set your preferred language and manage your account
						credentials.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<Separator className="w-full" />
					<div className="space-y-1">
						<Label>Email</Label>
						<p className="text-sm text-muted-foreground font-normal">
							This is the email you will use to login and receive
							emails for.
						</p>
						<Button
							variant="outline"
							onClick={() => setIsUpdateEmailDialogOpen(true)}
						>
							Update Email
						</Button>
					</div>
					<div className="space-y-1">
						<Label>Password</Label>
						<p className="text-sm text-muted-foreground font-normal">
							This will be the password you use for future logins.
						</p>
						<Button
							variant="outline"
							onClick={() =>
								setIsUpdatePasswordIsDialogOpen(true)
							}
						>
							Update Password
						</Button>
					</div>
					<div className="space-y-1">
						<Label>Delete Account</Label>
						<p className="text-sm text-muted-foreground font-normal">
							This action cannot be undone. Please be certain
						</p>
						<Button
							variant="destructive"
							onClick={() => setIsAccountDeleteDialogOpen(true)}
						>
							Delete Account
						</Button>
					</div>
				</CardContent>
			</Card>
			<DeleteAccountDialog
				isDialogOpen={isAccountDeleteDialogOpen}
				setIsDialogOpen={setIsAccountDeleteDialogOpen}
				displayname={userProfile.display_name}
			/>
			<UpdateEmailDialog
				isDialogOpen={isUpdateEmailDialogOpen}
				setIsDialogOpen={setIsUpdateEmailDialogOpen}
				email={userProfile.email}
				toast={toast}
			/>
			<UpdatePasswordDialog
				isDialogOpen={isUpdatePasswordDialogOpen}
				setIsDialogOpen={setIsUpdatePasswordIsDialogOpen}
				toast={toast}
			/>
		</>
	);
}
