import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateEmail } from "@/lib/actions";
import { UserProfile } from "@/lib/types";
import { useActionState, useEffect } from "react";

type UpdateEmailDialogProps = {
	isDialogOpen: boolean;
	setIsDialogOpen: (arg0: boolean) => void;
	userProfile: UserProfile;
	setUserProfile: (arg0: UserProfile) => void;
	toast: (arg0: { title: string; description: string }) => void;
};

export default function UpdateEmailDialog({
	isDialogOpen,
	setIsDialogOpen,
	userProfile,
	setUserProfile,
	toast,
}: UpdateEmailDialogProps) {
	const [state, action, pending] = useActionState(updateEmail, undefined);

	useEffect(() => {
		if (state?.updatedEmail !== undefined) {
			setUserProfile({
				...userProfile,
				email: state.updatedEmail,
			});

			toast({
				title: "Success!",
				description:
					"Please check your inboxes for the confirmation emails.",
			});

			setIsDialogOpen(false);
		}
	}, [state?.updatedEmail]);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Email</DialogTitle>
					<DialogDescription>
						Enter your new email below. Confirmation emails will be
						sent to your old and new inboxes.
					</DialogDescription>
				</DialogHeader>
				<form action={action}>
					<Input
						id="email"
						name="email"
						type="text"
						defaultValue={userProfile.email}
						className="max-w-[400px]"
					/>
					{state?.errors?.email && (
						<p className="text-sm text-destructive">
							{state.errors.email}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button type="submit" className="mb-2 sm:mb-0">
							{pending ? "Updating..." : "Update Email"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
