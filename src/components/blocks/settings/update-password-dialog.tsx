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
import { useToast } from "@/hooks/use-toast";
import { updatePassword } from "@/lib/actions";
import { useActionState, useEffect } from "react";

export default function UpdatePasswordDialog() {
	const { toast } = useToast();

	const [state, action, pending] = useActionState(updatePassword, undefined);

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
				<Button variant="outline">Update Password</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Update Password</DialogTitle>
					<DialogDescription>
						Please enter your new password below and confirm it. Make sure to
						use a strong password for security.
					</DialogDescription>
				</DialogHeader>
				<form>
					<Input
						id="newPassword"
						name="newPassword"
						type="password"
						placeholder="New Password"
						className="max-w-[400px]"
					/>
					{state?.errors?.newPassword && (
						<p className="text-sm text-destructive">
							{state.errors.newPassword}
						</p>
					)}
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						className="max-w-[400px] mt-2"
					/>
					{state?.errors?.confirmPassword && (
						<p className="text-sm text-destructive">
							{state.errors.confirmPassword}
						</p>
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
							formAction={action}
							disabled={pending}
							className="mb-2 sm:mb-0"
						>
							{pending ? "Updating..." : "Update Password"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
