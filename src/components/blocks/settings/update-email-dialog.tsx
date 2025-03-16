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
import { useActionState, useEffect } from "react";

type UpdateEmailDialogProps = {
	isDialogOpen: boolean;
	setIsDialogOpen: (arg0: boolean) => void;
	email: string;
	toast: (arg0: { title: string; description: string }) => void;
};

export default function UpdateEmailDialog({
	isDialogOpen,
	setIsDialogOpen,
	email,
	toast,
}: UpdateEmailDialogProps) {
	const [state, action, pending] = useActionState(updateEmail, undefined);

	useEffect(() => {
		if (state?.toast !== undefined) {
			toast({
				title: state.toast.title,
				description: state.toast.message,
			});

			setIsDialogOpen(false);
		}
	}, [state?.toast]);

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
				<form>
					<Input
						id="email"
						name="email"
						type="text"
						defaultValue={email}
						className="max-w-[400px]"
					/>
					{state?.errors?.email && (
						<p className="text-sm text-destructive">
							{state.errors.email}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button
							type="button"
							className="mb-2 sm:mb-0"
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							Go Back
						</Button>
						<Button
							type="submit"
							className="mb-2 sm:mb-0"
							formAction={action}
							disabled={pending}
						>
							{pending ? "Updating..." : "Update Email"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
