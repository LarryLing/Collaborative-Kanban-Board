"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import DeleteAccountDialog from "./delete-account-dialog";
import UpdateEmailDialog from "./update-email-dialog";
import UpdatePasswordDialog from "./update-password-dialog";

type AccountSettingsProps = {
	email: string;
};

export default function AccountSettings({ email }: AccountSettingsProps) {
	return (
		<Card className="border-none shadow-none flex-auto">
			<CardHeader className="md:pt-0">
				<CardTitle>Account</CardTitle>
				<CardDescription>
					Set your preferred language and manage your account credentials.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<Separator className="w-full" />
				<div className="space-y-1">
					<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Email
					</p>
					<p className="text-sm text-muted-foreground font-normal">
						This is the email you will use to login and receive emails for.
					</p>
					<UpdateEmailDialog email={email} />
				</div>
				<div className="space-y-1">
					<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Password
					</p>
					<p className="text-sm text-muted-foreground font-normal">
						This will be the password you use for future logins.
					</p>
					<UpdatePasswordDialog />
				</div>
				<div className="space-y-1">
					<p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
						Delete Account
					</p>
					<p className="text-sm text-muted-foreground font-normal">
						This action cannot be undone. Please be certain
					</p>
					<DeleteAccountDialog />
				</div>
			</CardContent>
		</Card>
	);
}
