"use client";

import { Button } from "@/components/ui/button";
import { BoardType } from "@/lib/types";
import { getLastOpened } from "@/lib/utils";
import { Bookmark, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import BoardOptionsDropdown from "./board-options-dropdown";
import RenameDialog from "./rename-dialog";
import DeleteDialog from "./delete-dialog";

export default function GalleryView({ boards }: { boards: BoardType[] }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
	coverPath,
	bookmarked,
	title,
	lastOpened,
}: BoardType) {
	const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	return (
		<div className="max-w-[450px] md:max-h-none w-full h-[280px] border border-border rounded-md overflow-hidden relative group">
			<Link href={`/board/${boardId}`}>
				<div className="h-[188px] bg-accent/30 group-hover:bg-accent/50 relative transition-colors">
					{coverPath && (
						<Image
							src={coverPath}
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
						{/* {collaborative && (
							<Users className="size-4 inline-block" />
						)} */}
						{bookmarked && (
							<Bookmark className="size-4 inline-block" />
						)}
						<span className="font-normal text-sm">
							Opened {getLastOpened(lastOpened)}
						</span>
					</div>
				</div>
			</Link>
			<div className="absolute bottom-4 right-4">
				<BoardOptionsDropdown
					side="top"
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
			className="w-full h-[280px] flex items-center justify-center gap-2"
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	);
}
