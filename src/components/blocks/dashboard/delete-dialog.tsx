import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

type DeleteDialogProps = {
	id: string
	isDeleteDialogOpen: boolean
	setIsDeleteDialogOpen: (arg0: boolean) => void
}

export default function DeleteDialog({
	id,
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
						type="submit"
						variant="destructive"
						className="mb-2 sm:mb-0"
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
