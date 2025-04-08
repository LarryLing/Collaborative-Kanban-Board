"use client";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { bookmarkBoard } from "@/lib/actions";
import { Board, UserProfile } from "@/lib/types";
import { Bookmark, PenLine, Trash2 } from "lucide-react";
import React from "react";
import RenameBoardDialog from "../dashboard/rename-board-dialog";
import DeleteBoardDialog from "../dashboard/delete-board-dialog";
import InviteUsersDialog from "./invite-users-dialog";

type BoardHeaderProps = {
	boardId: string;
	viewerId: string;
	fetchedCollaborators: UserProfile[];
} & Board;

export default function BoardHeader({
	id,
	profile_id: ownerId,
	title,
	bookmarked,
	has_invite_permissions,
	boardId,
	viewerId,
	fetchedCollaborators,
}: BoardHeaderProps) {
	return (
		<div className="space-y-4">
			<h3 className="resize-none border-none focus-visible:ring-0 p-0 shadow-none font-semibold md:text-3xl">
				{title}
			</h3>
			<div className="flex justify-between">
				<InviteUsersDialog
					ownerId={ownerId}
					viewerId={viewerId}
					hasInvitePermissions={has_invite_permissions}
					boardId={boardId}
					fetchedCollaborators={fetchedCollaborators}
				/>
				<div className="space-x-2">
					<RenameBoardDialog title={title} boardId={id}>
						<Button variant="outline" size="icon">
							<PenLine />
						</Button>
					</RenameBoardDialog>
					<Toggle
						variant="outline"
						pressed={bookmarked}
						onPressedChange={() => bookmarkBoard(id, viewerId, bookmarked)}
					>
						<Bookmark />
					</Toggle>
					{ownerId === viewerId && (
						<DeleteBoardDialog boardId={id}>
							<Button variant="outline" size="icon">
								<Trash2 />
							</Button>
						</DeleteBoardDialog>
					)}
				</div>
			</div>
		</div>
	);
}
