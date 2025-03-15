"use client";

import { createClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import { ChangeEvent, useState } from "react";

export function useProfile(
	userProfile: UserProfile,
	setUserProfile: (arg0: UserProfile) => void,
	toast: (arg0: { title: string; description: string }) => void,
) {
	const supabase = createClient();
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

		console.log(filePath);

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
	};

	return { uploadAvatar, uploading, error };
}
