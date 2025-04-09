import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bookmark, Ellipsis, PenLine, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import React, { memo } from "react";
import Link from "next/link";
import RenameBoardDialog from "./rename-board-dialog";
import DeleteBoardDialog from "./delete-board-dialog";
import { Board } from "@/lib/types";

type OptionsDropdownProps = {
	side: "top" | "right" | "bottom" | "left" | undefined;
	viewerId: string;
	renameBoard: (oldTitle: string, newTitle: string, boardId: string) => Promise<void>;
	bookmarkBoard: (
		boardId: string,
		profileId: string,
		currentlyBookmarked: boolean,
	) => Promise<void>;
} & Board;

export default function BoardOptionsDropdown({
	id,
	profile_id,
	title,
	bookmarked,
	side,
	viewerId,
	renameBoard,
	bookmarkBoard,
}: OptionsDropdownProps) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side={side}>
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
				{profile_id === viewerId && (
					<DeleteBoardDialog boardId={id}>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<Trash2 />
							<span>Delete</span>
						</DropdownMenuItem>
					</DeleteBoardDialog>
				)}
				<Link href={`/board/${id}`} target="_blank" rel="noopener noreferrer">
					<DropdownMenuItem>
						<SquareArrowOutUpRight className="size-4" />
						<span>Open in new tab</span>
					</DropdownMenuItem>
				</Link>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const MemoizedBoardOptionsDropdown = memo(BoardOptionsDropdown);
