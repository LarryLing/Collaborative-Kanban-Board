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
import React, { ChangeEvent, useActionState, useEffect, useState } from "react";
import { updateUserProfile, uploadAvatar } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSocialIcon } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type ProfileClientComponentProps = {
	userProfile: UserProfile;
	publicUrl: string;
};

export default function ProfileClientComponent({
	userProfile,
	publicUrl,
}: ProfileClientComponentProps) {
	const { toast } = useToast();

	const [profileState, profileAction, profilePending] = useActionState(
		updateUserProfile,
		undefined,
	);
	const [avatarState, avatarAction, avatarPending] = useActionState(
		uploadAvatar,
		undefined,
	);
	const [avatarPreview, setAvatarPreview] = useState(publicUrl);
	const [uploading, setUploading] = useState(false);
	const MAX_FILE_SIZE = 5 * 1024 * 1024;

	async function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setUploading(true);

		if (!e.target.files || e.target.files?.length === 0) {
			setUploading(false);
			return;
		}

		if (e.target.files[0].size > MAX_FILE_SIZE) {
			setUploading(false);
			return;
		}

		const file = e.target.files[0];
		setAvatarPreview(URL.createObjectURL(file));
		setUploading(false);
	}

	useEffect(() => {
		if (profileState?.updatedProfile !== undefined) {
			toast({
				title: "Success!",
				description: "Your profile has been successfully updated.",
			});
		}

		if (avatarState?.publicUrl !== undefined) {
			setAvatarPreview(avatarState.publicUrl);
			toast({
				title: "Success!",
				description: "Your avatar has been successfully updated.",
			});
		}

		if (profileState?.errorMessage !== undefined) {
			toast({
				title: "Something went wrong...",
				description: profileState.errorMessage,
			});
		}

		if (avatarState?.errorMessage !== undefined) {
			toast({
				title: "Something went wrong...",
				description: avatarState.errorMessage,
			});
		}
	}, [
		profileState?.updatedProfile,
		avatarState?.publicUrl,
		profileState?.errorMessage,
		avatarState?.errorMessage,
	]);

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
					<form className="space-y-2" action={avatarAction}>
						<Label htmlFor="avatar">Avatar</Label>
						<Avatar className="size-[200px]">
							<AvatarImage src={avatarPreview} />
							<AvatarFallback>
								{userProfile.display_name
									.substring(0, 2)
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<Input
							id="avatar"
							name="avatar"
							type="file"
							accept="image/*"
							onChange={(e) => handleChange(e)}
							disabled={uploading}
							className="justify-center items-center"
						/>
						{avatarState?.errors?.avatar && (
							<p className="text-sm text-destructive">
								{avatarState?.errors?.avatar}
							</p>
						)}
						<Button type="submit" disabled={avatarPending}>
							{avatarPending ? "Uploading..." : "Upload Avatar"}
						</Button>
					</form>
					<form
						action={profileAction}
						className="basis-[500px] space-y-6"
					>
						<div className="space-y-1">
							<Label htmlFor="displayName">Display Name</Label>
							<Input
								id="displayName"
								name="displayName"
								type="text"
								defaultValue={
									profileState?.updatedProfile?.displayName ||
									userProfile.display_name
								}
							/>
							{profileState?.errors?.displayName && (
								<p className="text-sm text-destructive">
									{profileState.errors.displayName}
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
								id="aboutMe"
								name="aboutMe"
								className="resize-none h-[100px]"
								defaultValue={
									profileState?.updatedProfile?.aboutMe ||
									userProfile.about_me
								}
							/>
							{profileState?.errors?.aboutMe && (
								<p className="text-sm text-destructive">
									{profileState.errors.aboutMe}
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
										{getSocialIcon(social.url)}
										<Input
											id={`social${index}`}
											name={`social${index}`}
											type="text"
											placeholder="Link to social profile"
											defaultValue={social.url}
										/>
									</div>
								);
							})}
							{profileState?.errors?.social0 && (
								<p className="text-sm text-destructive">
									{profileState?.errors?.social0}
								</p>
							)}
							{profileState?.errors?.social1 && (
								<p className="text-sm text-destructive">
									{profileState?.errors?.social1}
								</p>
							)}
							{profileState?.errors?.social2 && (
								<p className="text-sm text-destructive">
									{profileState?.errors?.social2}
								</p>
							)}
							{profileState?.errors?.social3 && (
								<p className="text-sm text-destructive">
									{profileState?.errors?.social3}
								</p>
							)}
						</div>
						<Button type="submit" disabled={profilePending}>
							{profilePending ? "Updating..." : "Update Profile"}
						</Button>
					</form>
				</div>
			</CardContent>
		</Card>
	);
}
