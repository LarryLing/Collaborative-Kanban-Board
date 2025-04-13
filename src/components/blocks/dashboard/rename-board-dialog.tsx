import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { FormEvent, ReactNode, useRef, useState } from "react";

type RenameDialogProps = {
	boardId: string;
	title: string;
	renameBoard: (oldTitle: string, newTitle: string, boardId: string) => Promise<void>;
	children: ReactNode;
};

export default function RenameBoardDialog({
	boardId,
	title,
	renameBoard,
	children,
}: RenameDialogProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [pending, setPending] = useState(false);

	const titleRef = useRef<HTMLInputElement>(null);

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setPending(true);

		await renameBoard(title, titleRef.current?.value || "Untitled Board", boardId);

		setPending(false);
		setIsDialogOpen(false);
	}

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rename Board</DialogTitle>
					<DialogDescription>
						Please enter a new name for this board
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={(e) => handleSubmit(e)}>
					<Input
						ref={titleRef}
						placeholder={title}
						defaultValue={title}
						className="col-span-3"
					/>
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
