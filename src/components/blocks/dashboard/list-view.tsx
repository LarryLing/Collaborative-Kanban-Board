"use client"

import { Button } from "@/components/ui/button"
import { BoardType } from "@/lib/types"
import { getLastOpened } from "@/lib/utils"
import { Plus, Users } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import RenameDialog from "./rename-dialog"
import OptionsDropdown from "./options-dropdown"

export default function ListView({ boards }: { boards: BoardType[] }) {
	return (
		<div className="space-y-2">
			{boards.map((board) => {
				return <BoardItem {...board} key={board.id} />
			})}
			<NewBoardItem />
		</div>
	)
}

function BoardItem({ id, owner, cover, title, last_opened }: BoardType) {
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	return (
		<div className="w-full h-[56px] border border-border rounded-md overflow-hidden pl-4 pr-2 py-2 relative">
			<Link
				href={`/boards/${id}`}
				className="md:max-w-[500px] lg:max-w-[700px] h-full flex justify-between items-center"
			>
				<div className="flex justify-center items-center gap-5">
					<span className="font-semibold text-md">{title}</span>
					<Users className="size-4 inline-block" />
				</div>
				<span className="hidden md:inline w-[160px] text-left font-normal text-sm">
					Opened {getLastOpened(last_opened)}
				</span>
			</Link>
			<div className="absolute bottom-2 right-2">
				<OptionsDropdown
					id={id}
					title={title}
					isDialogOpen={isDialogOpen}
					setIsDialogOpen={setIsDialogOpen}
				/>
			</div>
			<RenameDialog
				id={id}
				title={title}
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
			/>
		</div>
	)
}

function NewBoardItem() {
	return (
		<Button
			variant="outline"
			className="w-full h-[56px] overflow-hidden flex justify-start items-center gap-2 pl-4 pr-2"
		>
			<span className="font-semibold text-md">New Board</span>
			<Plus className="size-4" />
		</Button>
	)
}
