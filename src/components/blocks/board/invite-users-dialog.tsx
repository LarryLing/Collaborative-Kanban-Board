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
import { DoorOpen, UserMinus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileWidget from "../misc/profile-widget";
import useCollaborators from "@/hooks/use-collaborators";
import { createClient } from "@/lib/supabase/client";
import { Collaborator } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type BoardHeaderProps = {
	ownerId: string;
	boardId: string;
	viewerId: string;
	hasInvitePermissions: boolean;
	fetchedCollaborators: Collaborator[];
};

export default function InviteUsersDialog({
	ownerId,
	boardId,
	viewerId,
	hasInvitePermissions,
	fetchedCollaborators,
}: BoardHeaderProps) {
	const supabase = createClient();

	const { toast } = useToast();

	const { collaborators, addCollaborator, removeCollaborator } = useCollaborators(
		supabase,
		boardId,
		viewerId,
		fetchedCollaborators,
	);

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
					Invite Collaborators
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite Collaborators</DialogTitle>
					<DialogDescription>
						Share this board with some friends or project partners.
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
							className="w-full"
						/>
						{collaborator.profile_id !== ownerId && (
							<Button
								variant="destructive"
								size="icon"
								disabled={
									!hasInvitePermissions &&
									collaborator.profile_id !== viewerId
								}
								onClick={() =>
									removeCollaborator(boardId, collaborator.profile_id)
								}
							>
								{collaborator.profile_id === viewerId ? (
									<DoorOpen />
								) : (
									<UserMinus />
								)}
							</Button>
						)}
					</div>
				))}
				{hasInvitePermissions ? (
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
							You do not have permission to invite or remove collaborators
						</p>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
