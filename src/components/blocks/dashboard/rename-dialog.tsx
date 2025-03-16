import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { renameBoard } from "@/lib/actions";
import { useActionState, useEffect } from "react";

type RenameDialogProps = {
	boardId: string;
	title: string;
	isRenameDialogOpen: boolean;
	setIsRenameDialogOpen: (arg0: boolean) => void;
};

export default function RenameDialog({
	boardId,
	title,
	isRenameDialogOpen,
	setIsRenameDialogOpen,
}: RenameDialogProps) {
	const initialState = {
		errors: undefined,
		boardId: boardId,
		updatedTitle: title,
	};

	const [state, action, pending] = useActionState(renameBoard, initialState);

	useEffect(() => {
		setIsRenameDialogOpen(false);
	}, [state?.updatedTitle]);

	return (
		<Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rename Board</DialogTitle>
					<DialogDescription>
						Please enter a new name for this board
					</DialogDescription>
				</DialogHeader>
				<form action={action}>
					<Input
						id="title"
						name="title"
						placeholder={title}
						defaultValue={state?.updatedTitle || title}
						className="col-span-3"
					/>
					{state?.errors?.title && (
						<p className="text-sm text-destructive">
							{state.errors.title}
						</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsRenameDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={pending}
							className="mb-2 sm:mb-0"
						>
							{pending ? "Renaming..." : "Rename"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
