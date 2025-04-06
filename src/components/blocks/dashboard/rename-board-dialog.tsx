import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { renameBoard } from "@/lib/actions";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { PenLine } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

type RenameDialogProps = {
	boardId: string;
	title: string;
};

export default function RenameBoardDialog({ boardId, title }: RenameDialogProps) {
	const initialState = {
		errors: undefined,
		boardId: boardId,
		updatedTitle: title,
	};

	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [state, action, pending] = useActionState(renameBoard, initialState);

	useEffect(() => {
		if (state?.updatedTitle !== undefined) setIsDialogOpen(false);
	}, [state?.updatedTitle]);

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<PenLine className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>
			</DialogTrigger>
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
						<p className="text-sm text-destructive">{state.errors.title}</p>
					)}
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</DialogClose>
						<Button type="submit" disabled={pending} className="mb-2 sm:mb-0">
							{pending ? "Renaming..." : "Rename"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
