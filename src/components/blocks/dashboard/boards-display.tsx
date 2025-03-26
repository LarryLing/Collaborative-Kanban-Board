"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState, useSyncExternalStore } from "react";
import BoardOptionsDropdown from "./board-options-dropdown";
import RenameDialog from "./rename-dialog";
import DeleteDialog from "./delete-dialog";
import { createBoard } from "@/lib/actions";
import { Board, ViewOptions } from "@/lib/types";
import { processBoards, getDateString } from "@/lib/utils";
import { ownership, sort, bookmarked, view } from "../../../lib/storage-utils";

type BoardsDisplayProps = {
	id: string;
	boards: Board[];
	query: string;
};

export default function BoardsDisplay({
	id,
	boards,
	query,
}: BoardsDisplayProps) {
	const ownershipState = useSyncExternalStore(
		ownership.subscribe,
		ownership.getSnapshot,
	);
	const sortState = useSyncExternalStore(sort.subscribe, sort.getSnapshot);
	const bookmarkedState = useSyncExternalStore(
		bookmarked.subscribe,
		bookmarked.getSnapshot,
	);
	const viewState = useSyncExternalStore(view.subscribe, view.getSnapshot);

	const processedBoards = useMemo(
		() =>
			processBoards(
				id,
				boards,
				bookmarkedState,
				ownershipState,
				sortState,
				query,
			),
		[id, boards, bookmarkedState, ownershipState, sortState, query],
	);

	return (
		<div
			className={
				viewState === "gallery"
					? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					: "space-y-2"
			}
		>
			{processedBoards.map((board) => {
				return (
					<BoardItem key={board.id} board={board} view={viewState} />
				);
			})}
			<NewBoardItem view={viewState} />
		</div>
	);
}

type BoardItemProps = {
	view: ViewOptions;
	board: Board;
};

function BoardItem({ view, board }: BoardItemProps) {
	const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const { id, title, cover_path, bookmarked, collaborators, last_opened } =
		board;

	return (
		<div
			className={`${view === "gallery" ? "h-[280px] max-w-[450px] md:max-h-none group" : "h-auto hover:bg-accent/60 hover:text-accent-foreground transition-colors"} w-full border border-border rounded-md overflow-hidden relative`}
		>
			<Link href={`/board/${id}`}>
				{view === "gallery" ? (
					<>
						<div className="h-[188px] bg-accent/30 group-hover:bg-accent/50 relative transition-colors">
							{cover_path && (
								<Image
									src={cover_path}
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
									Opened {getDateString(last_opened)}
								</span>
							</div>
						</div>
					</>
				) : (
					<div className="md:max-w-[500px] lg:max-w-[700px] flex justify-between items-center p-4">
						<span className="font-semibold text-md">{title}</span>
						<div className="hidden md:flex items-start gap-4 w-[210px] text-left font-normal text-sm">
							<span className="w-[150px]">
								Opened {getDateString(last_opened)}
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
				<BoardOptionsDropdown
					side={view === "gallery" ? "top" : "left"}
					boardId={id}
					bookmarked={bookmarked}
					setIsRenameDialogOpen={setIsRenameDialogOpen}
					setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				/>
			</div>
			<RenameDialog
				boardId={id}
				title={title}
				isRenameDialogOpen={isRenameDialogOpen}
				setIsRenameDialogOpen={setIsRenameDialogOpen}
			/>
			<DeleteDialog
				boardId={id}
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
			/>
		</div>
	);
}

type NewBoardItemProps = {
	view: ViewOptions;
};

function NewBoardItem({ view }: NewBoardItemProps) {
	return (
		<Button
			variant="ghost"
			className={`${view === "gallery" ? "h-[280px]" : "h-[56px] overflow-hidden pl-4 pr-2"} w-full flex items-center justify-center gap-2`}
			onClick={() => createBoard()}
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	);
}
