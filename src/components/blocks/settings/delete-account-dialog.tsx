import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { deleteAccount } from "@/lib/actions";
import { useActionState } from "react";

type DeleteAccountDialogProps = {
	isDialogOpen: boolean;
	setIsDialogOpen: (arg0: boolean) => void;
};

export default function DeleteAccountDialog({
	isDialogOpen,
	setIsDialogOpen,
}: DeleteAccountDialogProps) {
	const [state, action, pending] = useActionState(deleteAccount, undefined);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete Account</DialogTitle>
					<DialogDescription>
						Please type your email below to confirm this action.
					</DialogDescription>
				</DialogHeader>
				<form>
					<Input
						id="prompt"
						name="prompt"
						type="text"
						placeholder="delete my account"
						className="max-w-[400px]"
					/>
					{state?.errors?.prompt && (
						<p className="text-sm text-destructive">
							{state.errors.prompt}
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
							variant="destructive"
							formAction={action}
							className="mb-2 sm:mb-0"
							disabled={pending}
						>
							{pending ? "Deleting..." : "Delete Account"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
