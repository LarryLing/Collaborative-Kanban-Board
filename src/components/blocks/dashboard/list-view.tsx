"use client";

import { Button } from "@/components/ui/button";
import { BoardType } from "@/lib/types";
import { getLastOpened } from "@/lib/utils";
import { Bookmark, Plus, Users } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import RenameDialog from "./rename-dialog";
import DeleteDialog from "./delete-dialog";
import BoardOptionsDropdown from "./board-options-dropdown";

export default function ListView({ boards }: { boards: BoardType[] }) {
	return (
		<div className="space-y-2">
			{boards.map((board) => {
				return <BoardItem {...board} key={board.boardId} />;
			})}
			<NewBoardItem />
		</div>
	);
}

function BoardItem({
	boardId,
	ownerId,
	bookmarked,
	title,
	lastOpened,
}: BoardType) {
	const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	return (
		<div className="w-full h-auto border border-border rounded-md overflow-hidden relative hover:bg-accent/60 hover:text-accent-foreground transition-colors">
			<Link href={`/board/${boardId}`}>
				<div className="md:max-w-[500px] lg:max-w-[700px] flex justify-between items-center p-4">
					<span className="font-semibold text-md">{title}</span>
					<div className="hidden md:flex items-start gap-4 w-[210px] text-left font-normal text-sm">
						<span className="w-[150px]">
							Opened {getLastOpened(lastOpened)}
						</span>
						<div className="space-x-2">
							{/* {collaborative && (
								<Users className="size-4 inline-block" />
							)} */}
							{bookmarked && (
								<Bookmark className="size-4 inline-block" />
							)}
						</div>
					</div>
				</div>
			</Link>
			<div className="absolute bottom-2.5 right-2">
				<BoardOptionsDropdown
					side="left"
					boardId={boardId}
					bookmarked={bookmarked}
					setIsRenameDialogOpen={setIsRenameDialogOpen}
					setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				/>
			</div>
			<RenameDialog
				boardId={boardId}
				title={title}
				isRenameDialogOpen={isRenameDialogOpen}
				setIsRenameDialogOpen={setIsRenameDialogOpen}
			/>
			<DeleteDialog
				boardId={boardId}
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
			/>
		</div>
	);
}

function NewBoardItem() {
	return (
		<Button
			variant="outline"
			className="w-full h-[56px] overflow-hidden flex justify-center items-center gap-2 pl-4 pr-2"
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	);
}
