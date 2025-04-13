import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bookmark, PenLine, Trash2 } from "lucide-react";
import React, { memo } from "react";
import { Board } from "@/lib/types";
import RenameBoardDialog from "../dashboard/rename-board-dialog";
import DeleteBoardDialog from "../dashboard/delete-board-dialog";

type MobileBoardOptionsProps = {
	viewerId: string;
	renameBoard: (oldTitle: string, newTitle: string, boardId: string) => Promise<void>;
	bookmarkBoard: (
		boardId: string,
		profileId: string,
		currentlyBookmarked: boolean,
	) => Promise<void>;
} & Board;

export default function MobileBoardOptions({
	id,
	owner_id,
	title,
	bookmarked,
	viewerId,
	renameBoard,
	bookmarkBoard,
}: MobileBoardOptionsProps) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Options</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<RenameBoardDialog boardId={id} title={title} renameBoard={renameBoard}>
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<PenLine />
						<span>Rename</span>
					</DropdownMenuItem>
				</RenameBoardDialog>
				<DropdownMenuItem onClick={() => bookmarkBoard(id, viewerId, bookmarked)}>
					<Bookmark className="size-4" />
					<span>Bookmark</span>
				</DropdownMenuItem>
				{owner_id === viewerId && (
					<DeleteBoardDialog boardId={id}>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<Trash2 />
							<span>Delete</span>
						</DropdownMenuItem>
					</DeleteBoardDialog>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const MemoizedMobileBoardOptions = memo(MobileBoardOptions);
