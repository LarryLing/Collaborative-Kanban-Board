import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { Ellipsis, SquareArrowOutUpRight, Trash2 } from "lucide-react"
import RenameDialog from "./rename-dialog"
import Link from "next/link"

type OptionsDropdownProps = {
	id: string
	title: string
}

export default function OptionsDropdown({ id, title }: OptionsDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Ellipsis className="size-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="top">
				<RenameDialog id={id} title={title} />
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
