import { Button } from "@/components/ui/button";
import { MailCheck, MailX } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

type UpdateInvitePermissionsButtonProps = {
	boardId: string;
	collaboratorId: string;
	collaboratorHasInvitePermissions: boolean;
	updateInvitePermissions: (
		boardId: string,
		profileId: string,
		previousInvitePermissions: boolean,
	) => Promise<void>;
};

export default function UpdateInvitePermissionsButton({
	boardId,
	collaboratorId,
	collaboratorHasInvitePermissions,
	updateInvitePermissions,
}: UpdateInvitePermissionsButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon"
						onClick={() =>
							updateInvitePermissions(
								boardId,
								collaboratorId,
								collaboratorHasInvitePermissions,
							)
						}
					>
						{collaboratorHasInvitePermissions ? <MailCheck /> : <MailX />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>
						{collaboratorHasInvitePermissions
							? "Remove invite permissions"
							: "Grant invite permissions"}
					</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
