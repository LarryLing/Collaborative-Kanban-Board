import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { PenLine } from "lucide-react"

type RenameDialogProps = {
	id: string
	title: string
}

export default function RenameDialog({ id, title }: RenameDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<DropdownMenuItem>
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
					<Button variant="outline">Cancel</Button>
					<Button type="submit">Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
