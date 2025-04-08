import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBoard } from "@/lib/actions";
import { DialogClose } from "@radix-ui/react-dialog";
import { ReactNode } from "react";

type DeleteDialogProps = {
	boardId: string;
	children: ReactNode;
};

export default function DeleteBoardDialog({ boardId, children }: DeleteDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Delete</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this board?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Go back</Button>
					</DialogClose>
					<Button
						variant="destructive"
						type="submit"
						className="mb-2 sm:mb-0"
						onClick={() => deleteBoard(boardId)}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
