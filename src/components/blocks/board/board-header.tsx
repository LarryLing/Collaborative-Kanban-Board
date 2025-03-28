"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { uploadCover } from "@/lib/actions";
import { createClient } from "@/lib/supabase/client";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type BoardHeaderProps = {
	boardId: string;
	boardTitle: string;
	boardCover: string | null;
};

export default function BoardHeader({
	boardId,
	boardTitle,
	boardCover,
}: BoardHeaderProps) {
	const supabase = createClient();

	const { toast } = useToast();

	const [coverPreview, setCoverPreview] = useState(boardCover);
	const [uploading, setUploading] = useState(false);

	const boardTitleRef = useRef<HTMLInputElement | null>(null);
	const coverPathRef = useRef<HTMLInputElement | null>(null);

	function handleClick() {
		if (coverPathRef.current) {
			coverPathRef.current.click();
		}
	}

	const handleTitleChange = useDebouncedCallback(async () => {
		const { error: updateTitleError } = await supabase
			.from("boards")
			.update({
				title: boardTitleRef.current?.value || "Untitled Board",
			})
			.eq("id", boardId);

		if (updateTitleError) throw updateTitleError;
	}, 1000);

	async function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setUploading(true);

		if (!e.target.files || e.target.files?.length === 0) {
			setUploading(false);
			return;
		}

		const file = e.target.files[0];

		const { publicUrl, errorMessage } = await uploadCover(boardId, file);

		if (publicUrl) {
			setCoverPreview(publicUrl);

			toast({
				title: "Success!",
				description: "The cover has been successfully updated.",
			});
		} else if (errorMessage) {
			toast({
				title: "Something went wrong...",
				description: errorMessage,
			});
		}

		setUploading(false);
	}

	return (
		<>
			<div className="w-full h-[225px] bg-accent/30 group-hover:bg-accent/50 rounded-md relative overflow-hidden">
				{coverPreview && (
					<Image
						src={coverPreview}
						alt=""
						objectFit="cover"
						layout="fill"
					/>
				)}
				<div className="absolute top-2 right-2">
					<div className="relative">
						<Input
							ref={coverPathRef}
							id="coverPath"
							name="coverPath"
							type="file"
							accept="image/*"
							onChange={(e) => handleChange(e)}
							disabled={uploading}
							className="size-9 opacity-0"
						/>
						<Button
							size="icon"
							className="absolute inset-0 z-5"
							onClick={() => handleClick()}
						>
							<Pencil />
						</Button>
					</div>
				</div>
			</div>
			<Input
				ref={boardTitleRef}
				id="title"
				name="title"
				className="resize-none border-none focus-visible:ring-0 p-0 shadow-none font-semibold md:text-3xl"
				defaultValue={boardTitle}
				onChange={() => handleTitleChange()}
			/>
		</>
	);
}
