import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogHeader,
	DialogContent,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteAccount } from "@/lib/actions";
import { useActionState, useEffect } from "react";

export default function DeleteAccountDialog() {
	const { toast } = useToast();

	const [state, action, pending] = useActionState(deleteAccount, undefined);

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
				<Button variant="destructive">Delete Account</Button>
			</DialogTrigger>
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
						<p className="text-sm text-destructive">{state.errors.prompt}</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<DialogClose asChild>
							<Button
								type="button"
								className="mb-2 sm:mb-0"
								variant="outline"
							>
								Go Back
							</Button>
						</DialogClose>
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
