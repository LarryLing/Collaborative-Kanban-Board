import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

type RenameDialogProps = {
	id: string
	title: string
	isRenameDialogOpen: boolean
	setIsRenameDialogOpen: (arg0: boolean) => void
}

export default function RenameDialog({
	id,
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
				</form>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsRenameDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
