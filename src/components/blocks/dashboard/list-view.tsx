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
		<div className="w-full h-auto border border-border rounded-md overflow-hidden relative">
			<Link href={`/boards/${id}`}>
				<div className="md:max-w-[500px] lg:max-w-[700px] flex justify-between items-center p-4">
					<span className="font-semibold text-md">{title}</span>
					<div className="hidden md:flex items-center gap-4 w-[180px] text-left font-normal text-sm">
						<Users className="size-4 inline-block" />
						<span>Opened {getLastOpened(last_opened)}</span>
					</div>
				</div>
			</Link>
			<div className="absolute bottom-2.5 right-2">
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
			className="w-full h-[56px] overflow-hidden flex justify-center items-center gap-2 pl-4 pr-2"
		>
			<Plus className="size-4" />
			<span className="font-semibold text-md">New Board</span>
		</Button>
	)
}
