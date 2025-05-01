import { Button } from "@/components/ui/button";
import { DoorOpen, UserMinus } from "lucide-react";
import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type RemoveCollaboratorButtonProps = {
	boardId: string;
	collaboratorId: string;
	viewerId: string;
	removeCollaborator: (boardId: string, removedId: string) => Promise<void>;
};

export default function RemoveCollaboratorButton({
	boardId,
	collaboratorId,
	viewerId,
	removeCollaborator,
}: RemoveCollaboratorButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="destructive"
						size="icon"
						onClick={() => removeCollaborator(boardId, collaboratorId)}
					>
						{viewerId === collaboratorId ? <DoorOpen /> : <UserMinus />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{viewerId === collaboratorId
							? "Leave board"
							: "Remove collaborator"}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
