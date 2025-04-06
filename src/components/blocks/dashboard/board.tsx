"use client";

import { Board as BoardType, ViewOptions } from "@/lib/types";
import { getDateString } from "@/lib/utils";
import { Users, Bookmark } from "lucide-react";
import { MemoizedBoardOptionsDropdown } from "./board-options-dropdown";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type BoardProps = {
	view: ViewOptions;
} & BoardType;

export default function Board({
	view,
	id,
	title,
	cover_path,
	bookmarked,
	collaborators,
	last_opened,
}: BoardProps) {
	const supabase = createClient();

	const coverPreview = cover_path
		? supabase.storage.from("covers").getPublicUrl(cover_path).data.publicUrl
		: null;

	const lastOpenedDateString = getDateString(last_opened);

	return (
		<div
			className={`${view === "gallery" ? "h-[280px] max-w-[450px] md:max-h-none group" : "h-auto hover:bg-accent/60 hover:text-accent-foreground transition-colors"} w-full border border-border rounded-md overflow-hidden relative`}
		>
			<Link href={`/board/${id}`}>
				{view === "gallery" ? (
					<>
						<div className="h-[188px] bg-accent/30 group-hover:bg-accent/50 relative transition-colors">
							{coverPreview && (
								<Image
									src={coverPreview}
									alt=""
									objectFit="cover"
									layout="fill"
								/>
							)}
						</div>
						<div className="h-[92px] p-4 flex flex-col justify-start items-between bg-inherit group-hover:bg-accent/60 transition-colors">
							<span className="font-semibold text-md text-left">
								{title}
							</span>
							<div className="flex justify-start items-center gap-2 basis-[40px]">
								{collaborators > 1 && (
									<Users className="size-4 inline-block" />
								)}
								{bookmarked && (
									<Bookmark className="size-4 inline-block" />
								)}
								<span className="font-normal text-sm">
									Opened {lastOpenedDateString}
								</span>
							</div>
						</div>
					</>
				) : (
					<div className="md:max-w-[500px] lg:max-w-[700px] flex justify-between items-center p-4">
						<span className="font-semibold text-md">{title}</span>
						<div className="hidden md:flex items-start gap-4 w-[210px] text-left font-normal text-sm">
							<span className="w-[150px]">
								Opened {lastOpenedDateString}
							</span>
							<div className="space-x-2">
								{collaborators > 1 && (
									<Users className="size-4 inline-block" />
								)}
								{bookmarked && (
									<Bookmark className="size-4 inline-block" />
								)}
							</div>
						</div>
					</div>
				)}
			</Link>
			<div
				className={`absolute ${view === "gallery" ? "bottom-4 right-4" : "bottom-2.5 right-2"}`}
			>
				<MemoizedBoardOptionsDropdown
					side={view === "gallery" ? "top" : "left"}
					boardId={id}
					boardTitle={title}
					bookmarked={bookmarked}
				/>
			</div>
		</div>
	);
}
