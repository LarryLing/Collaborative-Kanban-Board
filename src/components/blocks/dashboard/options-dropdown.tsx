import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
	Bookmark,
	Ellipsis,
	PenLine,
	SquareArrowOutUpRight,
	Trash2,
} from "lucide-react"
import React from "react"
import Link from "next/link"

type OptionsDropdownProps = {
	id: string
	title: string
	bookmarked: boolean
	setIsRenameDialogOpen: (arg0: boolean) => void
	setIsDeleteDialogOpen: (arg0: boolean) => void
}

export default function OptionsDropdown({
	id,
	title,
	setIsRenameDialogOpen,
	setIsDeleteDialogOpen,
}: OptionsDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top">
				<DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
					<PenLine className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Bookmark className="size-4" />
					<span>Bookmark</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					className="group"
					onClick={() => setIsDeleteDialogOpen(true)}
				>
					<Trash2 className="size-4 group-hover:stroke-destructive" />
					<span className="group-hover:text-destructive">Delete</span>
				</DropdownMenuItem>
				<Link
					href={`/boards/${id}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<DropdownMenuItem>
						<SquareArrowOutUpRight className="size-4" />
						<span>Open in new tab</span>
					</DropdownMenuItem>
				</Link>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
