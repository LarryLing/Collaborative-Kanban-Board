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
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { resetPassword } from "@/lib/actions";
import React, { useActionState, useState } from "react";
import { UserProfile } from "@/lib/types";

type AccountSettingsProps = {
	userProfile: UserProfile;
};

export default function AccountSettings({ userProfile }: AccountSettingsProps) {
	const [state, action, pending] = useActionState(resetPassword, undefined);
	const [language, setLanguage] = useState("en");

	return (
		<Card className="border-none shadow-none">
			<CardHeader className="pt-0">
				<CardTitle>Account</CardTitle>
				<CardDescription>
					Set your preferred language and manage your account
					credentials.
				</CardDescription>
			</CardHeader>
			<form action={action}>
				<CardContent className="space-y-6">
					<Separator className="w-full" />
					<div className="space-y-1">
						<Label htmlFor="language">Language</Label>
						<Select
							onValueChange={setLanguage}
							defaultValue={language}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Select Language" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="en">English</SelectItem>
									<SelectItem value="fr">French</SelectItem>
									<SelectItem value="de">German</SelectItem>
									<SelectItem value="es">Spanish</SelectItem>
									<SelectItem value="pt">
										Portuguese
									</SelectItem>
									<SelectItem value="ru">Russian</SelectItem>
									<SelectItem value="ja">Japanese</SelectItem>
									<SelectItem value="ko">Korean</SelectItem>
									<SelectItem value="zh">Chinese</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						{/* {state?.errors?.displayName && (
							<p className="text-sm text-destructive">
								{state.errors.displayName}
							</p>
						)} */}
						<p className="text-sm text-muted-foreground font-normal">
							This is the language that will be used in the
							dashboard.
						</p>
					</div>
					<div className="space-y-1">
						<Label htmlFor="email">Email</Label>
						<Input
							placeholder="m@example.com"
							defaultValue={userProfile.email}
							id="email"
							name="bio"
							className="max-w-[400px]"
						/>
						{/* {state?.errors?.bio && (
							<p className="text-sm text-destructive">
								{state.errors.bio}
							</p>
						)} */}
						<p className="text-sm text-muted-foreground font-normal">
							This is the email you will use to login and receive
							emails for.
						</p>
					</div>
					<div className="space-y-1">
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
						<p className="text-sm text-muted-foreground font-normal">
							This will be the password you use for future logins.
						</p>
					</div>
					<Button type="submit" disabled={pending}>
						Update Account
					</Button>
				</CardContent>
			</form>
		</Card>
	);
}
