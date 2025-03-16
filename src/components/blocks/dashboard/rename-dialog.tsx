import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
	return (
		<Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rename Board</DialogTitle>
					<DialogDescription>
						Please enter a new name for this board
					</DialogDescription>
				</DialogHeader>
				<form>
					<Input
						id="title"
						defaultValue={title}
						className="col-span-3"
					/>
					<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsRenameDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" className="mb-2 sm:mb-0">
							Save changes
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
