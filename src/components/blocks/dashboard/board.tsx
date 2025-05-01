"use client";

import { Board as BoardType, ViewOptions } from "@/lib/types";
import { getDateString } from "@/lib/utils";
import { Users, Bookmark } from "lucide-react";
import { MemoizedBoardOptionsDropdown } from "./board-options-dropdown";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import useBoard from "@/hooks/use-board";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

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
						<div className="h-[198px] bg-accent/30 group-hover:bg-accent/50 relative transition-colors">
							{coverUrl && (
								<Image
									src={coverUrl}
									alt=""
									objectFit="cover"
									layout="fill"
								/>
							)}
						</div>
						<div className="p-4 bg-inherit group-hover:bg-accent/60 transition-colors">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<p className="font-semibold text-md inline-block max-w-[calc(100%-52px)] truncate">
											{board.title}
										</p>
									</TooltipTrigger>
									<TooltipContent>
										<p>{board.title}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<div className="flex justify-start items-center gap-2">
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
					<div className="max-w-[calc(100%-52px)] lg:max-w-[calc(100%-200px)] flex justify-between items-center gap-8 p-4">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<p className="font-semibold text-md max-w-[225px] md:max-w-none truncate">
										{board.title}
									</p>
								</TooltipTrigger>
								<TooltipContent>
									<p>{board.title}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<div className="flex flex-row-reverse md:flex-row items-start gap-4 text-left font-normal text-sm">
							<p className="w-[150px] hidden md:block">
								Opened {lastOpenedDateString}
							</p>
							<div className="space-x-2 min-w-10">
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
				className={`absolute ${view === "gallery" ? "bottom-5 right-4" : "bottom-2.5 right-2"}`}
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
