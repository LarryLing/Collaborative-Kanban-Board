import { UserProfile } from "@/lib/types";
import React from "react";
import { MemoizedBoardUserPopover } from "./board-user-popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type BoardUserGroupProps = {
	boardUsers: UserProfile[];
};

export default function BoardUserGroup({ boardUsers }: BoardUserGroupProps) {
	const truncatedBoardUsers = boardUsers.slice(0, 4);
	const remainingUserCount = boardUsers.length - 4;

	return (
		<div className="flex -space-x-2">
			{truncatedBoardUsers.map((activeProfile) => (
				<MemoizedBoardUserPopover key={activeProfile.id} {...activeProfile} />
			))}
			{remainingUserCount > 0 && (
				<Avatar>
					<AvatarFallback>+{remainingUserCount}</AvatarFallback>
				</Avatar>
			)}
		</div>
	);
}
