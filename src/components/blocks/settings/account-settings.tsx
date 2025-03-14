"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useActionState, useEffect, useState } from "react";
import { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { deleteAccount, updateEmail, updatePassword } from "@/lib/actions";

type AccountSettingsProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
	toast: (arg0: { title: string; description: string }) => void;
};

export default function AccountSettings({
	userProfile,
	setUserProfile,
	toast,
}: AccountSettingsProps) {
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
				displayname={userProfile.displayName}
			/>
			<UpdateEmailDialog
				isDialogOpen={isUpdateEmailDialogOpen}
				setIsDialogOpen={setIsUpdateEmailDialogOpen}
				userProfile={userProfile}
				setUserProfile={setUserProfile}
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

type DialogProps = {
	isDialogOpen: boolean;
	setIsDialogOpen: (arg0: boolean) => void;
};

type DeleteAccountDialogProps = {
	displayname: string;
};

function DeleteAccountDialog({
	isDialogOpen,
	setIsDialogOpen,
	displayname,
}: DialogProps & DeleteAccountDialogProps) {
	const [state, action, pending] = useActionState(deleteAccount, undefined);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Account</DialogTitle>
					<DialogDescription>
						Please type your username below to confirm this action.
					</DialogDescription>
				</DialogHeader>
				<form action={action}>
					<Input
						id="displayName"
						name="displayName"
						type="text"
						placeholder={displayname}
						className="max-w-[400px]"
					/>
					{state?.errors?.displayName && (
						<p className="text-sm text-destructive">
							{state.errors.displayName}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button
							type="submit"
							variant="destructive"
							className="mb-2 sm:mb-0"
							disabled={pending}
						>
							{pending ? "Deleting..." : "Delete Account"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

type UpdateEmailDialogProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
	toast: (arg0: { title: string; description: string }) => void;
};

function UpdateEmailDialog({
	isDialogOpen,
	setIsDialogOpen,
	userProfile,
	setUserProfile,
	toast,
}: DialogProps & UpdateEmailDialogProps) {
	const [state, action, pending] = useActionState(updateEmail, undefined);

	useEffect(() => {
		if (state?.updatedEmail !== undefined) {
			setUserProfile({
				...userProfile,
				email: state.updatedEmail,
			});

			toast({
				title: "Success!",
				description:
					"Please check your inboxes for the confirmation emails.",
			});

			setIsDialogOpen(false);
		}
	}, [state?.updatedEmail]);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Email</DialogTitle>
					<DialogDescription>
						Enter your new email below. Confirmation emails will be
						sent to your old and new inboxes.
					</DialogDescription>
				</DialogHeader>
				<form action={action}>
					<Input
						id="email"
						name="email"
						type="text"
						defaultValue={userProfile.email}
						className="max-w-[400px]"
					/>
					{state?.errors?.email && (
						<p className="text-sm text-destructive">
							{state.errors.email}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button type="submit" className="mb-2 sm:mb-0">
							{pending ? "Updating..." : "Update Email"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

type UpdatePasswordDialogProps = {
	toast: (arg0: { title: string; description: string }) => void;
};

function UpdatePasswordDialog({
	isDialogOpen,
	setIsDialogOpen,
	toast,
}: DialogProps & UpdatePasswordDialogProps) {
	const [state, action, pending] = useActionState(updatePassword, undefined);

	useEffect(() => {
		if (state?.toast !== undefined) {
			toast({
				title: "Success!",
				description: state?.toast,
			});

			setIsDialogOpen(false);
		}
	}, [state?.toast]);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Password</DialogTitle>
					<DialogDescription>
						Please enter your new password below and confirm it.
						Make sure to use a strong password for security.
					</DialogDescription>
				</DialogHeader>
				<form action={action}>
					<Input
						id="newPassword"
						name="newPassword"
						type="password"
						placeholder="New Password"
						className="max-w-[400px]"
					/>
					{state?.errors?.newPassword && (
						<p className="text-sm text-destructive">
							{state.errors.newPassword}
						</p>
					)}
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						className="max-w-[400px] mt-2"
					/>
					{state?.errors?.confirmPassword && (
						<p className="text-sm text-destructive">
							{state.errors.confirmPassword}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button
							type="submit"
							disabled={pending}
							className="mb-2 sm:mb-0"
						>
							{pending ? "Updating..." : "Update Password"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
