"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { UserProfile } from "@/lib/types";

type AccountSettingsProps = {
	userProfile: UserProfile;
};

export default function AccountSettings({ userProfile }: AccountSettingsProps) {
	return (
		<Card className="border-none shadow-none">
			<CardHeader className="pt-0 pr-0">
				<CardTitle>Account</CardTitle>
				<CardDescription>
					Set your preferred language and manage your account
					credentials.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 pr-0">
				<Separator className="w-full" />
				<div className="space-y-1">
					<Label>Email</Label>
					<p className="text-sm text-muted-foreground font-normal">
						This is the email you will use to login and receive
						emails for.
					</p>
					<Button variant="outline" className="block">
						Update Email
					</Button>
				</div>
				<div className="space-y-1">
					<Label>Password</Label>
					<p className="text-sm text-muted-foreground font-normal">
						This will be the password you use for future logins.
					</p>
					<Button variant="outline" className="block">
						Update Password
					</Button>
				</div>
				{/* <div className="space-y-1">
					<Label htmlFor="social">Password</Label>
					<div className="flex flex-col justify-center items-start gap-2">
						<Input
							id="currentPassword"
							name="currentPassword"
							type="text"
							placeholder="Current Password"
							className="max-w-[400px]"
						/>
						{state?.errors?.password && (
							<p className="text-sm text-destructive">
								{state.errors.password}
							</p>
						)}
						<Input
							id="newPassword"
							name="newPassword"
							type="text"
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
							type="text"
							placeholder="Confirm Password"
							className="max-w-[400px]"
						/>
						{state?.errors?.confirmPassword && (
							<p className="text-sm text-destructive">
								{state.errors.confirmPassword}
							</p>
						)}
					</div>
					<p className="text-sm text-muted-foreground font-normal"></p>
				</div> */}
				<div className="space-y-1">
					<Label>Delete Account</Label>
					<p className="text-sm text-muted-foreground font-normal">
						This action cannot be undone. Please be certain
					</p>
					<Button variant="destructive">Delete Account</Button>
				</div>
			</CardContent>
		</Card>
	);
}
