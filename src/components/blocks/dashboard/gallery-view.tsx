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
import { Board } from "@/lib/types";

export default function GalleryView({ boards }: { boards: Board[] }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{boards.map((board) => {
				return <BoardItem {...board} key={board.board_id} />;
			})}
			<NewBoardItem />
		</div>
	);
}

function BoardItem({
	board_id,
	title,
	cover_path,
	bookmarked,
	collaborators,
	last_opened,
}: Board) {
	const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	return (
		<div className="max-w-[450px] md:max-h-none w-full h-[280px] border border-border rounded-md overflow-hidden relative group">
			<Link href={`/board/${board_id}`}>
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
			</Link>
			<div className="absolute bottom-4 right-4">
				<BoardOptionsDropdown
					side="top"
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

function NewBoardItem() {
	return (
		<Button
			variant="outline"
			className="w-full h-[280px] flex items-center justify-center gap-2"
			onClick={() => createBoard()}
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	);
}
