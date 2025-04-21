"use client";

import { Board as BoardType, ViewOptions } from "@/lib/types";
import { getDateString } from "@/lib/utils";
import { Users, Bookmark } from "lucide-react";
import { MemoizedBoardOptionsDropdown } from "./board-options-dropdown";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import useBoard from "@/hooks/use-board";

type BoardProps = {
	viewerId: string;
	fetchedBoard: BoardType;
	view: ViewOptions;
};

export default function Board({ viewerId, fetchedBoard, view }: BoardProps) {
	const supabase = createClient();

	const { board, coverUrl, bookmarkBoard, renameBoard } = useBoard(
		supabase,
		fetchedBoard,
	);

	const lastOpenedDateString = getDateString(board.last_opened);

	return (
		<div
			className={`${view === "gallery" ? "h-[280px] max-w-[450px] md:max-h-none group" : "h-auto hover:bg-accent/60 hover:text-accent-foreground transition-colors"} w-full border border-border rounded-md overflow-hidden relative`}
		>
			<Link href={`/board/${board.id}`}>
				{view === "gallery" ? (
					<>
						<div className="h-[188px] bg-accent/30 group-hover:bg-accent/50 relative transition-colors">
							{coverUrl && (
								<Image
									src={coverUrl}
									alt=""
									objectFit="cover"
									layout="fill"
								/>
							)}
						</div>
						<div className="h-[92px] p-4 flex flex-col justify-start items-between bg-inherit group-hover:bg-accent/60 transition-colors">
							<span className="font-semibold text-md text-left">
								{board.title}
							</span>
							<div className="flex justify-start items-center gap-2 basis-[40px]">
								{board.has_collaborators && (
									<Users className="size-4 inline-block" />
								)}
								{board.bookmarked && (
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
						<span className="font-semibold text-md">{board.title}</span>
						<div className="hidden md:flex items-start gap-4 w-[210px] text-left font-normal text-sm">
							<span className="w-[150px]">
								Opened {lastOpenedDateString}
							</span>
							<div className="space-x-2">
								{board.has_collaborators && (
									<Users className="size-4 inline-block" />
								)}
								{board.bookmarked && (
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
					{...board}
					side={view === "gallery" ? "top" : "left"}
					viewerId={viewerId}
					renameBoard={renameBoard}
					bookmarkBoard={bookmarkBoard}
				/>
			</div>
		</div>
	);
}
