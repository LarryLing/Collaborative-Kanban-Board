"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useActionState, useEffect } from "react";
import { updateUserProfile } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Link } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type ProfileSettingsProps = {
	userProfile: UserProfile;
};

export default function ProfileSettings({ userProfile }: ProfileSettingsProps) {
	const { toast } = useToast();
	const [state, action, pending] = useActionState(
		updateUserProfile,
		undefined,
	);

	useEffect(() => {
		if (state?.message !== undefined) {
			toast({
				title: "Success",
				description: state.message,
			});
		}
	}, [state?.message]);

	return (
		<Card className="border-none shadow-none flex-auto">
			<CardHeader className="md:pt-0">
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					This is how others will see you on the site.
				</CardDescription>
			</CardHeader>
			<form action={action}>
				<CardContent className="space-y-6">
					<Separator className="w-full" />
					<div className="space-y-1">
						<Label htmlFor="displayName">Display Name</Label>
						<Input
							id="displayName"
							name="displayName"
							type="text"
							defaultValue={userProfile.display_name}
						/>
						{state?.errors?.displayName && (
							<p className="text-sm text-destructive">
								{state.errors.displayName}
							</p>
						)}
						<p className="text-sm text-muted-foreground font-normal">
							You can only change this once every 30 days.
						</p>
					</div>
					<div className="space-y-1">
						<Label htmlFor="bio">About Me</Label>
						<Textarea
							placeholder="Tell us a little bit about yourself"
							defaultValue={userProfile.bio}
							id="bio"
							name="bio"
							className="resize-none h-[100px]"
						/>
						{state?.errors?.bio && (
							<p className="text-sm text-destructive">
								{state.errors.bio}
							</p>
						)}
					</div>
					<div className="space-y-1">
						<Label htmlFor="social">Social Accounts</Label>
						<div className="flex justify-center items-center gap-2">
							<Link className="size-4" />
							<Input
								id="social1"
								name="social1"
								type="text"
								placeholder="Link to social profile"
							/>
						</div>
						<div className="flex justify-center items-center gap-2">
							<Link className="size-4" />
							<Input
								id="social2"
								name="social2"
								type="text"
								placeholder="Link to social profile"
							/>
						</div>
						<div className="flex justify-center items-center gap-2">
							<Link className="size-4" />
							<Input
								id="social3"
								name="social3"
								type="text"
								placeholder="Link to social profile"
							/>
						</div>
					</div>
					<Button type="submit" disabled={pending}>
						Update Profile
					</Button>
				</CardContent>
			</form>
		</Card>
	);
}
