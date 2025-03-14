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
import { resetPassword, updateEmail } from "@/lib/actions";

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
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Account</DialogTitle>
					<DialogDescription>
						Please type your username below to confirm this action.
					</DialogDescription>
				</DialogHeader>
				<form>
					<Input
						id="delete"
						name="delete"
						type="text"
						placeholder={displayname}
						className="max-w-[400px]"
					/>
				</form>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsDialogOpen(false)}
					>
						Go back
					</Button>
					<Button
						type="submit"
						variant="destructive"
						className="mb-2 sm:mb-0"
					>
						Delete Account
					</Button>
				</DialogFooter>
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
				title: "Success",
				description:
					"Please check your inboxes for the confirmation emails",
			});
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
					<div>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							Go back
						</Button>
						<Button type="submit" className="mb-2 sm:mb-0">
							{pending ? "Updating..." : "Update Email"}
						</Button>
					</div>
				</form>
				{/* <DialogFooter></DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}

function UpdatePasswordDialog({ isDialogOpen, setIsDialogOpen }: DialogProps) {
	const [state, action, pending] = useActionState(resetPassword, undefined);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Password</DialogTitle>
					<DialogDescription>
						You will be asked to sign in again after confirming your
						password.
					</DialogDescription>
				</DialogHeader>
				<form
					className="flex flex-col justify-center items-start gap-2"
					action={action}
				>
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
						className="max-w-[400px]"
					/>
					{state?.errors?.confirmPassword && (
						<p className="text-sm text-destructive">
							{state.errors.confirmPassword}
						</p>
					)}
					<div>
						<Button
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							Go back
						</Button>
						<Button
							type="submit"
							disabled={pending}
							className="mb-2 sm:mb-0"
						>
							{pending ? "Updating..." : "Update Password"}
						</Button>
					</div>
				</form>
				{/* <DialogFooter></DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
