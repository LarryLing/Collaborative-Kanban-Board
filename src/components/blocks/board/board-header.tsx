"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBoardCover from "@/hooks/use-board-cover";
import useBoardTitle from "@/hooks/use-board-title";
import { createClient } from "@/lib/supabase/client";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";

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

	const { coverPreview, uploading, handleChange, coverPathRef } = useBoardCover(
		boardId,
		boardCover,
	);
	const { editTitle, boardTitleRef } = useBoardTitle(supabase, boardId);

	function openCoverPathInput() {
		if (coverPathRef.current) coverPathRef.current.click();
	}

	return (
		<>
			<div className="w-full h-[225px] bg-accent/30 group-hover:bg-accent/50 rounded-md relative overflow-hidden">
				{coverPreview && (
					<Image src={coverPreview} alt="" objectFit="cover" layout="fill" />
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
							onClick={openCoverPathInput}
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
				onChange={() =>
					editTitle(
						boardTitle,
						boardTitleRef.current?.value || "Untitled Board",
					)
				}
			/>
		</>
	);
}
