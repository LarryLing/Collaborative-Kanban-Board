import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Ellipsis, PenLine, SquareArrowOutUpRight, Trash2 } from "lucide-react"
import React from "react"
import Link from "next/link"

type OptionsDropdownProps = {
	id: string
	title: string
	isDialogOpen: boolean
	setIsDialogOpen: (arg0: boolean) => void
}

export default function OptionsDropdown({
	id,
	title,
	isDialogOpen,
	setIsDialogOpen,
}: OptionsDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top">
				<DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
					<PenLine className="size-4" />
					<span>Rename</span>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Trash2 className="size-4" />
					<span>Delete</span>
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
