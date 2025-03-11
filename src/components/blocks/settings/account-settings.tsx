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
import React, { useState } from "react";
import { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";

type AccountSettingsProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
};

export default function AccountSettings({
	userProfile,
	setUserProfile,
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
				displayname={userProfile.display_name}
			/>
			<UpdateEmailDialog
				isDialogOpen={isUpdateEmailDialogOpen}
				setIsDialogOpen={setIsUpdateEmailDialogOpen}
				email={userProfile.email}
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
	email: string;
};

function UpdateEmailDialog({
	isDialogOpen,
	setIsDialogOpen,
	email,
}: DialogProps & UpdateEmailDialogProps) {
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
				<form>
					<Input
						id="delete"
						name="delete"
						type="text"
						defaultValue={email}
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
					<Button type="submit" className="mb-2 sm:mb-0">
						Update Email
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function UpdatePasswordDialog({ isDialogOpen, setIsDialogOpen }: DialogProps) {
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
				<form className="flex flex-col justify-center items-start gap-2">
					<Input
						id="newPassword"
						name="newPassword"
						type="password"
						placeholder="New Password"
						className="max-w-[400px]"
					/>
					{/* {state?.errors?.newPassword && (
									<p className="text-sm text-destructive">
										{state.errors.newPassword}
									</p>
								)} */}
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						className="max-w-[400px]"
					/>
					{/* {state?.errors?.confirmPassword && (
									<p className="text-sm text-destructive">
										{state.errors.confirmPassword}
									</p>
								)} */}
				</form>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsDialogOpen(false)}
					>
						Go back
					</Button>
					<Button type="submit" className="mb-2 sm:mb-0">
						Update Password
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
