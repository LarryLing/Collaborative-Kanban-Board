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
import { updateUserProfile } from "@/lib/actions";
import { Textarea } from "@/components/ui/textarea";
import { UserProfile } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSocialIcon } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type ProfileSettingsProps = {
	userProfile: UserProfile;
	publicUrl: string;
	toast: (arg0: { title: string; description: string }) => void;
};

export default function ProfileSettings({
	userProfile,
	publicUrl,
	toast,
}: ProfileSettingsProps) {
	const supabase = createClient();
	const [state, action, pending] = useActionState(
		updateUserProfile,
		undefined,
	);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const MAX_FILE_SIZE = 6000000;

	const uploadAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
		setUploading(true);

		if (!e.target.files || e.target.files?.length === 0) {
			setUploading(false);
			return;
		}

		if (e.target.files[0].size > MAX_FILE_SIZE) {
			setError("Max file size is 6MB");
			setUploading(false);
			return;
		}

		const file = e.target.files[0];
		const fileExt = file.name.split(".").pop();
		const filePath = `${userProfile.id}/avatar_${Date.now()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file);

		if (uploadError) {
			toast({
				title: "Something went wrong...",
				description: "Failed to upload your avatar. Please try again.",
			});
			setUploading(false);
			return;
		}

		const { error: profileError } = await supabase
			.from("profiles")
			.update({
				avatar_path: filePath,
			})
			.eq("id", userProfile.id);

		if (profileError) {
			toast({
				title: "Something went wrong...",
				description:
					"Failed to sync your profile with S3. Please try again.",
			});
			setUploading(false);
			return;
		}

		setUploading(false);

		toast({
			title: "Success!",
			description: "Your avatar was successfully updated",
		});
	};

	useEffect(() => {
		if (state?.updatedProfile !== undefined) {
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
							<AvatarImage src={publicUrl} />
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
								defaultValue={
									state?.updatedProfile?.displayName ||
									userProfile.display_name
								}
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
								id="aboutMe"
								name="aboutMe"
								className="resize-none h-[100px]"
								defaultValue={
									state?.updatedProfile?.aboutMe ||
									userProfile.about_me
								}
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
