import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { updateEmail } from "@/lib/actions";
import { useActionState, useEffect } from "react";

type UpdateEmailDialogProps = {
	email: string;
};

export default function UpdateEmailDialog({ email }: UpdateEmailDialogProps) {
	const { toast } = useToast();

	const [state, action, pending] = useActionState(updateEmail, undefined);

	useEffect(() => {
		if (state?.toast !== undefined) {
			toast({
				title: state.toast.title,
				description: state.toast.description,
			});
		}
	}, [state?.toast, toast]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline">Update Email</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Email</DialogTitle>
					<DialogDescription>
						Enter your new email below. Confirmation emails will be sent to
						your old and new inboxes.
					</DialogDescription>
				</DialogHeader>
				<form>
					<div className="space-y-1">
						<Label htmlFor="email">New Email</Label>
						<Input
							id="email"
							name="email"
							type="text"
							autoComplete="on"
							defaultValue={email}
							className="max-w-[400px]"
						/>
					</div>
					{state?.errors?.email && (
						<p className="text-sm text-destructive">{state.errors.email}</p>
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
