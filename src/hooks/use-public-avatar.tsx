"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function usePublicAvatar(filePath: string | undefined) {
	const [publicAvatarUrl, setPublicAvatarUrl] = useState("");

	useEffect(() => {
		async function fetchAvatar() {
			if (filePath) {
				const supabase = await createClient();
				const { data } = await supabase.storage
					.from("avatars")
					.getPublicUrl(filePath);

				setPublicAvatarUrl(data.publicUrl);
			}
		}

		fetchAvatar();
	}, [filePath]);

	return { publicAvatarUrl };
}
