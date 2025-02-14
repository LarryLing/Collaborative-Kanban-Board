import { Button } from "@/components/ui/button"
import { BoardType } from "@/lib/types"
import { getLastOpened } from "@/lib/utils"
import { Ellipsis, Plus } from "lucide-react"
import React from "react"

export default function Board({ id, owner, title, last_opened }: BoardType) {
	return (
		<div className="w-full h-[240px] border border-border rounded-md overflow-hidden relative group">
			<Button
				size="icon"
				className="absolute top-3 right-3 group-hover:flex hidden"
			>
				<Ellipsis className="size-4" />
			</Button>
			<div className="w-full h-[160px] bg-border"></div>
			<div className="w-full h-[80px] p-4 flex justify-between items-center">
				<div>
					<h2 className="font-semibold text-lg">{title}</h2>
					<p className="font-normal text-sm">
						Last Opened: {getLastOpened(last_opened)}
					</p>
				</div>
			</div>
		</div>
	)
}

export function NewBoard() {
	return (
		<div className="w-full h-[240px] border border-border rounded-md overflow-hidden flex items-center justify-center gap-2">
			<Plus className="size-6" />
			<span className="font-medium text-md ">New Board</span>
		</div>
	)
}
