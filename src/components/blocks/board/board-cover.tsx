"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useBoardCover from "@/hooks/use-board-cover";
import { Pencil } from "lucide-react";
import Image from "next/image";
import React from "react";

type BoardHeaderProps = {
	boardId: string;
	boardCover: string | null;
};

export default function BoardCover({ boardId, boardCover }: BoardHeaderProps) {
	const { coverPreview, uploading, handleChange, coverPathRef } = useBoardCover(
		boardId,
		boardCover,
	);

	function openCoverPathInput() {
		if (coverPathRef.current) coverPathRef.current.click();
	}

	return (
		<div className="w-full h-[225px] bg-accent/30 group-hover:bg-accent/50 rounded-md relative overflow-hidden">
			{coverPreview && (
				<Image src={coverPreview} alt="" objectFit="cover" layout="fill" />
			)}
			{uploading && <Skeleton className="size-full" />}
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
	);
}
