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
import { bookmarkBoard } from "@/lib/actions";
import RenameBoardDialog from "./rename-board-dialog";
import DeleteBoardDialog from "./delete-board-dialog";

type OptionsDropdownProps = {
	side: "top" | "right" | "bottom" | "left" | undefined;
	boardId: string;
	ownerId: string;
	viewerId: string;
	boardTitle: string;
	bookmarked: boolean;
};

export default function BoardOptionsDropdown({
	side,
	boardId,
	ownerId,
	viewerId,
	boardTitle,
	bookmarked,
}: OptionsDropdownProps) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side={side}>
				<RenameBoardDialog boardId={boardId} title={boardTitle}>
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<PenLine />
						<span>Rename</span>
					</DropdownMenuItem>
				</RenameBoardDialog>
				<DropdownMenuItem
					onClick={() => bookmarkBoard(boardId, viewerId, bookmarked)}
				>
					<Bookmark className="size-4" />
					<span>Bookmark</span>
				</DropdownMenuItem>
				{ownerId === viewerId && (
					<DeleteBoardDialog boardId={boardId}>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<Trash2 />
							<span>Delete</span>
						</DropdownMenuItem>
					</DeleteBoardDialog>
				)}
				<Link
					href={`/board/${boardId}`}
					target="_blank"
					rel="noopener noreferrer"
				>
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
