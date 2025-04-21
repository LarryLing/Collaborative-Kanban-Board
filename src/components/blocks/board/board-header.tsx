"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Board, BoardMember, Collaborator } from "@/lib/types";
import { Bookmark, ImageUp, PenLine, Trash2 } from "lucide-react";
import React from "react";
import RenameBoardDialog from "../dashboard/rename-board-dialog";
import DeleteBoardDialog from "../dashboard/delete-board-dialog";
import useBoard from "@/hooks/use-board";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import usePresence from "@/hooks/use-presence";
import BoardUserGroup from "./board-user-group";
import { MemoizedMobileBoardOptions } from "./mobile-board-options";
import InviteUsersDialog from "./invite-users-dialog";

type BoardHeaderProps = {
	boardMember: BoardMember;
	fetchedBoard: Board;
	fetchedCollaborators: Collaborator[];
};

export default function BoardHeader({
	boardMember,
	fetchedBoard,
	fetchedCollaborators,
}: BoardHeaderProps) {
	const supabase = createClient();

	const {
		board,
		coverUrl,
		uploading,
		handleChange,
		bookmarkBoard,
		renameBoard,
		coverPathRef,
	} = useBoard(supabase, fetchedBoard);

	const { activeProfiles } = usePresence(supabase, board.id, boardMember.member_id);

	function openCoverPathInput() {
		if (coverPathRef.current) coverPathRef.current.click();
	}

	return (
		<div className="space-y-6">
			<div className="w-full h-[225px] bg-accent/30 group-hover:bg-accent/50 rounded-md relative overflow-hidden">
				{coverUrl && (
					<Image src={coverUrl} alt="" objectFit="cover" layout="fill" />
				)}
				{uploading && <Skeleton className="size-full" />}
				<div className="absolute top-2 right-2">
					<div className="relative">
						<Input
							ref={coverPathRef}
							id="coverPath"
							name="coverPath"
							type="file"
							accept="image/*"
							onChange={(e) => handleChange(e)}
							disabled={uploading}
							className="size-9 opacity-0"
						/>
						<Button
							size="icon"
							className="absolute inset-0 z-5"
							onClick={openCoverPathInput}
						>
							<ImageUp />
						</Button>
					</div>
				</div>
			</div>
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h3 className="resize-none border-none focus-visible:ring-0 p-0 shadow-none font-semibold md:text-3xl">
						{board.title}
					</h3>
					<BoardUserGroup boardUsers={activeProfiles} />
				</div>
				<div className="flex justify-between">
					<InviteUsersDialog
						boardId={board.id}
						ownerId={board.owner_id}
						fetchedCollaborators={fetchedCollaborators}
						{...boardMember}
					/>
					<div className="space-x-2 hidden md:block">
						<RenameBoardDialog
							title={board.title}
							boardId={board.id}
							renameBoard={renameBoard}
						>
							<Button variant="outline" size="icon">
								<PenLine />
							</Button>
						</RenameBoardDialog>
						<Toggle
							variant="outline"
							pressed={board.bookmarked}
							onPressedChange={() =>
								bookmarkBoard(
									board.id,
									boardMember.member_id,
									board.bookmarked,
								)
							}
						>
							<Bookmark />
						</Toggle>
						{board.owner_id === boardMember.member_id && (
							<DeleteBoardDialog boardId={board.id}>
								<Button variant="outline" size="icon">
									<Trash2 />
								</Button>
							</DeleteBoardDialog>
						)}
					</div>
					<div className="block md:hidden">
						<MemoizedMobileBoardOptions
							{...board}
							viewerId={boardMember.member_id}
							renameBoard={renameBoard}
							bookmarkBoard={bookmarkBoard}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
