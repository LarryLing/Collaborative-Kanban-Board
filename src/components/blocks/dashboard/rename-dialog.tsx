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
	isDialogOpen: boolean
	setIsDialogOpen: (arg0: boolean) => void
}

export default function RenameDialog({
	id,
	title,
	isDialogOpen,
	setIsDialogOpen,
}: RenameDialogProps) {
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Rename Board</DialogTitle>
					<DialogDescription>
						Please enter a new name for this board
					</DialogDescription>
				</DialogHeader>
				<form className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Input
							id="title"
							defaultValue={title}
							className="col-span-3"
						/>
					</div>
				</form>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsDialogOpen(false)}
					>
						Cancel
					</Button>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
