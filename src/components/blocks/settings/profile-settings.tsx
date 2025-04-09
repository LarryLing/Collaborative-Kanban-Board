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
import { useToast } from "@/hooks/use-toast";
import useAvatar from "@/hooks/use-avatar";

type ProfileSettingsProps = {
	publicUrl: string;
} & UserProfile;

export default function ProfileSettings({
	id,
	display_name,
	about_me,
	socials,
	publicUrl,
}: ProfileSettingsProps) {
	const { toast } = useToast();

	const [state, action, pending] = useActionState(updateUserProfile, undefined);

	const { uploading, changeAvatar, avatarInputRef } = useAvatar(id);

	useEffect(() => {
		if (state?.toast !== undefined) {
			toast({
				title: state.toast.title,
				description: state.toast.message,
			});
		}
	}, [state?.toast]);

	function openAvatarUploadInput() {
		if (avatarInputRef.current) avatarInputRef.current.click();
	}

	return (
		<>
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
								<AvatarImage src={publicUrl} />
								<AvatarFallback>
									{display_name.substring(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Button
								type="button"
								onClick={openAvatarUploadInput}
								disabled={uploading}
							>
								{uploading ? "Uploading..." : "Upload Avatar"}
							</Button>
						</form>
						<form action={action} className="basis-[500px] space-y-6">
							<div className="space-y-1">
								<Label htmlFor="displayName">Display Name</Label>
								<Input
									id="displayName"
									name="displayName"
									type="text"
									defaultValue={display_name}
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
									defaultValue={about_me}
								/>
								{state?.errors?.aboutMe && (
									<p className="text-sm text-destructive">
										{state.errors.aboutMe}
									</p>
								)}
							</div>
							<div className="space-y-1">
								<Label>Social Accounts</Label>
								{socials.map((social, index) => {
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
			<Input
				ref={avatarInputRef}
				id="avatar"
				name="avatar"
				type="file"
				accept="image/*"
				onChange={(e) => changeAvatar(e)}
				className="hidden"
			/>
		</>
	);
}
