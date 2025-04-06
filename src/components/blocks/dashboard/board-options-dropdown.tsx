import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bookmark, Ellipsis, SquareArrowOutUpRight } from "lucide-react";
import React, { memo } from "react";
import Link from "next/link";
import { bookmarkBoard } from "@/lib/actions";
import RenameBoardDialog from "./rename-board-dialog";
import DeleteBoardDialog from "./delete-board-dialog";

type OptionsDropdownProps = {
	side: "top" | "right" | "bottom" | "left" | undefined;
	boardId: string;
	boardTitle: string;
	bookmarked: boolean;
};

export default function BoardOptionsDropdown({
	side,
	boardId,
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
				<RenameBoardDialog boardId={boardId} title={boardTitle} />
				<DropdownMenuItem onClick={() => bookmarkBoard(boardId, bookmarked)}>
					<Bookmark className="size-4" />
					<span>Bookmark</span>
				</DropdownMenuItem>
				<DeleteBoardDialog boardId={boardId} />
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
