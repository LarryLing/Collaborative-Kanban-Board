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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSocialIcon } from "@/lib/utils";
import { useProfile } from "@/hooks/use-profile";

type ProfileSettingsProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
	toast: (arg0: { title: string; description: string }) => void;
};

export default function ProfileSettings({
	userProfile,
	setUserProfile,
	toast,
}: ProfileSettingsProps) {
	const { uploadAvatar, uploading, error } = useProfile(
		userProfile,
		setUserProfile,
		toast,
	);
	const [state, action, pending] = useActionState(
		updateUserProfile,
		undefined,
	);

	useEffect(() => {
		if (state?.updatedProfile !== undefined) {
			setUserProfile({
				id: userProfile.id,
				email: userProfile.email,
				displayName: state.updatedProfile.displayName,
				aboutMe: state.updatedProfile.aboutMe,
				avatarUrl: userProfile.avatarUrl,
				socials: state.updatedProfile.socials,
			});

			toast({
				title: "Success!",
				description: "Your profile has been successfully updated.",
			});
		}
	}, [state?.updatedProfile]);

	return (
		<Card className="border-none shadow-none flex-auto">
			<CardHeader className="md:pt-0">
				<CardTitle>Profile</CardTitle>
				<CardDescription>
					This is how others will see you on the site.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<Separator className="w-full" />
				<div className="flex flex-col lg:flex-row-reverse gap-6">
					<form className="space-y-2" action={action}>
						<Label htmlFor="avatar">Avatar</Label>
						<Avatar className="size-[200px]">
							<AvatarImage src={userProfile.avatarUrl} />
							<AvatarFallback>
								{userProfile.displayName
									.substring(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<Input
							id="avatar"
							name="avatar"
							type="file"
							accept="image/*"
							onChange={(e) => uploadAvatar(e)}
							disabled={uploading}
							className="justify-center items-center"
						/>
						{error && (
							<p className="text-sm text-destructive">{error}</p>
						)}
					</form>
					<form action={action} className="basis-[500px] space-y-6">
						<div className="space-y-1">
							<Label htmlFor="displayName">Display Name</Label>
							<Input
								id="displayName"
								name="displayName"
								type="text"
								defaultValue={userProfile.displayName}
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
							<Label htmlFor="aboutMe">About Me</Label>
							<Textarea
								placeholder="Tell us a little bit about yourself"
								defaultValue={userProfile.aboutMe}
								id="aboutMe"
								name="aboutMe"
								className="resize-none h-[100px]"
							/>
							{state?.errors?.aboutMe && (
								<p className="text-sm text-destructive">
									{state.errors.aboutMe}
								</p>
							)}
						</div>
						<div className="space-y-1">
							<Label htmlFor="social">Social Accounts</Label>
							{userProfile.socials.map((social, index) => {
								return (
									<div
										key={`social${index}`}
										className="flex justify-center items-center gap-2"
									>
										{getSocialIcon(social)}
										<Input
											id={`social${index}`}
											name={`social${index}`}
											type="text"
											placeholder="Link to social profile"
											defaultValue={social}
										/>
									</div>
								);
							})}
							{state?.errors?.social0 && (
								<p className="text-sm text-destructive">
									{state?.errors?.social0}
								</p>
							)}
							{state?.errors?.social1 && (
								<p className="text-sm text-destructive">
									{state?.errors?.social1}
								</p>
							)}
							{state?.errors?.social2 && (
								<p className="text-sm text-destructive">
									{state?.errors?.social2}
								</p>
							)}
							{state?.errors?.social3 && (
								<p className="text-sm text-destructive">
									{state?.errors?.social3}
								</p>
							)}
						</div>
						<Button type="submit" disabled={pending}>
							{pending ? "Updating..." : "Update Profile"}
						</Button>
					</form>
				</div>
			</CardContent>
		</Card>
	);
}
