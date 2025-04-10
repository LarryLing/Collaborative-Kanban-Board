"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Board, Collaborator } from "@/lib/types";
import { Bookmark, Pencil, PenLine, Trash2 } from "lucide-react";
import React from "react";
import RenameBoardDialog from "../dashboard/rename-board-dialog";
import DeleteBoardDialog from "../dashboard/delete-board-dialog";
import InviteUsersDialog from "./invite-users-dialog";
import useBoard from "@/hooks/use-board";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import usePresence from "@/hooks/use-presence";

type BoardHeaderProps = {
	viewerId: string;
	fetchedBoard: Board;
	fetchedCollaborators: Collaborator[];
};

export default function BoardHeader({
	viewerId,
	fetchedBoard,
	fetchedCollaborators,
}: BoardHeaderProps) {
	const supabase = createClient();

	const {
		board,
		coverPreview,
		uploadingPreview,
		handleChange,
		bookmarkBoard,
		renameBoard,
		coverPathRef,
	} = useBoard(supabase, fetchedBoard);

	const { userState, activeProfiles } = usePresence(supabase, board.id, viewerId);

	function openCoverPathInput() {
		if (coverPathRef.current) coverPathRef.current.click();
	}

	return (
		<div className="space-y-6">
			<div className="w-full h-[225px] bg-accent/30 group-hover:bg-accent/50 rounded-md relative overflow-hidden">
				{coverPreview && (
					<Image src={coverPreview} alt="" objectFit="cover" layout="fill" />
				)}
				{uploadingPreview && <Skeleton className="size-full" />}
				<div className="absolute top-2 right-2">
					<div className="relative">
						<Input
							ref={coverPathRef}
							id="coverPath"
							name="coverPath"
							type="file"
							accept="image/*"
							onChange={(e) => handleChange(e)}
							disabled={uploadingPreview}
							className="size-9 opacity-0"
						/>
						<Button
							size="icon"
							className="absolute inset-0 z-5"
							onClick={openCoverPathInput}
						>
							<Pencil />
						</Button>
					</div>
				</div>
			</div>
			<div className="space-y-4">
				<h3 className="resize-none border-none focus-visible:ring-0 p-0 shadow-none font-semibold md:text-3xl">
					{board.title}
				</h3>
				<div className="flex justify-between">
					<InviteUsersDialog
						boardId={board.id}
						ownerId={board.profile_id}
						viewerId={viewerId}
						hasInvitePermissions={board.has_invite_permissions}
						fetchedCollaborators={fetchedCollaborators}
					/>
					<div className="space-x-2">
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
								bookmarkBoard(board.id, viewerId, board.bookmarked)
							}
						>
							<Bookmark />
						</Toggle>
						{board.profile_id === viewerId && (
							<DeleteBoardDialog boardId={board.id}>
								<Button variant="outline" size="icon">
									<Trash2 />
								</Button>
							</DeleteBoardDialog>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
