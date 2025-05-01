"use client";

import React, { useActionState, useEffect } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileWidget from "../misc/profile-widget";
import useCollaborators from "@/hooks/use-collaborators";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPermissions, Collaborator } from "@/lib/types";
import RemoveCollaboratorButton from "./remove-collaborator-button";
import UpdateInvitePermissionsButton from "./update-invite-permissions-button";

type BoardHeaderProps = {
	viewerId: string;
	ownerId: string;
	boardId: string;
	fetchedCollaborators: Collaborator[];
} & UserPermissions;

export default function InviteUsersDialog({
	viewerId,
	ownerId,
	boardId,
	has_invite_permissions,
	fetchedCollaborators,
}: BoardHeaderProps) {
	const supabase = createClient();

	const { toast } = useToast();

	const {
		collaborators,
		addCollaborator,
		removeCollaborator,
		updateInvitePermissions,
	} = useCollaborators(supabase, boardId, viewerId, fetchedCollaborators);

	const [state, action, pending] = useActionState(addCollaborator, undefined);

	useEffect(() => {
		if (state?.toast !== undefined) {
			toast({
				title: state.toast.title,
				description: state.toast.message,
			});
		}
	}, [state?.toast]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					<UserPlus />
					<span>Collaborators</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite Collaborators</DialogTitle>
					<DialogDescription>
						Share this board with project partners.
					</DialogDescription>
				</DialogHeader>
				{collaborators.map((collaborator) => (
					<div
						key={collaborator.profile_id}
						className="flex justify-between items-center"
					>
						<ProfileWidget
							displayName={collaborator.display_name}
							email={collaborator.email}
							avatarUrl={collaborator.avatar_url}
							className="w-full sm:max-w-[300px] max-w-[180px] overflow-hidden whitespace-nowrap text-ellipsis"
						/>
						{collaborator.profile_id !== ownerId ? (
							<div className="space-x-2 flex items-center">
								{viewerId === ownerId && (
									<UpdateInvitePermissionsButton
										boardId={boardId}
										collaboratorId={collaborator.profile_id}
										collaboratorHasInvitePermissions={
											collaborator.has_invite_permissions
										}
										updateInvitePermissions={updateInvitePermissions}
									/>
								)}
								<RemoveCollaboratorButton
									boardId={boardId}
									collaboratorId={collaborator.profile_id}
                                    viewerId={viewerId}
									removeCollaborator={removeCollaborator}
								/>
							</div>
						) : (
							<p className="text-sm text-muted-foreground">Owner</p>
						)}
					</div>
				))}
				{has_invite_permissions ? (
					<form action={action} className="">
						<div className="flex flex-col justify-start">
							<Input
								id="email"
								name="email"
								className="col-span-3 w-full"
								placeholder="m@example.com"
							/>
							{state?.errors?.email && (
								<p className="text-sm text-destructive">
									{state.errors.email}
								</p>
							)}
						</div>
						<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
							<DialogClose asChild>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</DialogClose>
							<Button
								type="submit"
								disabled={pending}
								className="mb-2 sm:mb-0"
							>
								{pending ? "Inviting..." : "Invite"}
							</Button>
						</div>
					</form>
				) : (
					<DialogFooter>
						<p className="text-sm text-muted-foreground">
							You do not have permission to edit collaborators
						</p>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
