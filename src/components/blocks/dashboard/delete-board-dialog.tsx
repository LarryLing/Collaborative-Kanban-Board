import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { deleteBoard } from "@/lib/actions";

type DeleteDialogProps = {
	boardId: string;
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (arg0: boolean) => void;
};

export default function DeleteBoardDialog({
	boardId,
	isDeleteDialogOpen,
	setIsDeleteDialogOpen,
}: DeleteDialogProps) {
	return (
		<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Confirm Delete</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this board?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsDeleteDialogOpen(false)}
					>
						Go back
					</Button>
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
