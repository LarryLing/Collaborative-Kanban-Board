"use client";

import { Button } from "@/components/ui/button";
import { getLastOpened } from "@/lib/utils";
import { Bookmark, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import BoardOptionsDropdown from "./board-options-dropdown";
import RenameDialog from "./rename-dialog";
import DeleteDialog from "./delete-dialog";
import { createBoard } from "@/lib/actions";
import { Board, ViewOptions } from "@/lib/types";

type BoardsDisplayProps = {
	view: ViewOptions;
	boards: Board[];
};

export default function BoardsDisplay({ view, boards }: BoardsDisplayProps) {
	return (
		<div
			className={
				view === ""
					? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					: "space-y-2"
			}
		>
			{boards.map((board) => {
				return (
					<BoardItem key={board.board_id} board={board} view={view} />
				);
			})}
			<NewBoardItem view={view} />
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

	const {
		board_id,
		title,
		cover_path,
		bookmarked,
		collaborators,
		last_opened,
	} = board;

	return (
		<div
			className={`${view === "" ? "h-[280px] max-w-[450px] md:max-h-none group" : "h-auto hover:bg-accent/60 hover:text-accent-foreground transition-colors"} w-full border border-border rounded-md overflow-hidden relative`}
		>
			<Link href={`/board/${board_id}`}>
				{view === "" ? (
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
									Opened {getLastOpened(last_opened)}
								</span>
							</div>
						</div>
					</>
				) : (
					<div className="md:max-w-[500px] lg:max-w-[700px] flex justify-between items-center p-4">
						<span className="font-semibold text-md">{title}</span>
						<div className="hidden md:flex items-start gap-4 w-[210px] text-left font-normal text-sm">
							<span className="w-[150px]">
								Opened {getLastOpened(last_opened)}
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
				className={`absolute ${view === "" ? "bottom-4 right-4" : "bottom-2.5 right-2"}`}
			>
				<BoardOptionsDropdown
					side={view === "" ? "top" : "left"}
					boardId={board_id}
					bookmarked={bookmarked}
					setIsRenameDialogOpen={setIsRenameDialogOpen}
					setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				/>
			</div>
			<RenameDialog
				boardId={board_id}
				title={title}
				isRenameDialogOpen={isRenameDialogOpen}
				setIsRenameDialogOpen={setIsRenameDialogOpen}
			/>
			<DeleteDialog
				boardId={board_id}
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
			variant="outline"
			className={`${view === "" ? "h-[280px]" : "h-[56px] overflow-hidden pl-4 pr-2"} w-full flex items-center justify-center gap-2`}
			onClick={() => createBoard()}
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	);
}
