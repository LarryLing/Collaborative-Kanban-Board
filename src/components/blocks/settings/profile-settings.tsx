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
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSocialIcon } from "@/lib/utils";

type ProfileSettingsProps = {
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
};

export default function ProfileSettings({
	userProfile,
	setUserProfile,
}: ProfileSettingsProps) {
	const supabase = createClient();

	const [uploading, setUploading] = useState(false);
	const [imageTooLarge, setImageTooLarge] = useState(false);
	const MAX_FILE_SIZE = 6000000;

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

	async function uploadAvatar(e: ChangeEvent<HTMLInputElement>) {
		setUploading(true);

		if (!e.target.files || e.target.files?.length === 0) {
			setUploading(false);
			return;
		}
		setImageTooLarge(e.target.files[0].size > MAX_FILE_SIZE);
		if (e.target.files[0].size > MAX_FILE_SIZE) {
			setUploading(false);
			return;
		}

		const file = e.target.files[0];
		const fileExt = file.name.split(".").pop();
		const filePath = `${userProfile.id}/avatar_${Date.now()}.${fileExt}`;

		const { error: uploadError } = await supabase.storage
			.from("avatars")
			.upload(filePath, file);

		if (uploadError) throw uploadError;

		const { error: profileError } = await supabase
			.from("profiles")
			.update({
				avatar: filePath,
			})
			.eq("id", userProfile.id);

		if (profileError) throw profileError;

		const { data: publicUrl } = await supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		setUserProfile({
			...userProfile,
			avatarUrl: publicUrl.publicUrl,
		});

		setUploading(false);

		toast({
			title: "Success",
			description: "Your avatar was successfully updated!",
		});
	}

	const test_socials = [
		"https://www.linkedin.com/in/larry-ling-student/",
		"https://github.com/LarryLing",
		"https://www.instagram.com/larryling.04/",
	];

	const urls = test_socials.map((test_social) => new URL(test_social));

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
					<form className="space-y-2">
						<Label htmlFor="avatar">Avatar</Label>
						<Avatar className="size-[200px]">
							<AvatarImage src={userProfile.avatarUrl} />
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
						{imageTooLarge && (
							<p className="text-sm text-destructive">
								Max file size is 6MB
							</p>
						)}
					</form>
					<form action={action} className="basis-[500px] space-y-6">
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
								{getSocialIcon(urls[0].hostname)}
								<Input
									id="social1"
									name="social1"
									type="text"
									placeholder="Link to social profile"
									defaultValue={urls[0].href}
								/>
							</div>
							<div className="flex justify-center items-center gap-2">
								{getSocialIcon(urls[1].hostname)}
								<Input
									id="social2"
									name="social2"
									type="text"
									placeholder="Link to social profile"
									defaultValue={urls[1].href}
								/>
							</div>
							<div className="flex justify-center items-center gap-2">
								{getSocialIcon(urls[2].hostname)}
								<Input
									id="social3"
									name="social3"
									type="text"
									placeholder="Link to social profile"
									defaultValue={urls[2].href}
								/>
							</div>
						</div>
						<Button type="submit" disabled={pending}>
							Update Profile
						</Button>
					</form>
				</div>
			</CardContent>
		</Card>
	);
}
