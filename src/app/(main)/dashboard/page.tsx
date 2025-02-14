import Boards from "@/components/blocks/dashboard/boards"
import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header"
import { Separator } from "@/components/ui/separator"
import { BoardType } from "@/lib/types"
import React from "react"

export default async function DashboardPage() {
	const boards: BoardType[] = [
		{
			id: "1",
			owner: "John Doe",
			title: "Board 1",
			last_opened: "2025-02-14T06:00:00Z",
		},
		{
			id: "2",
			owner: "Jane Smith",
			title: "Board 2",
			last_opened: "2023-10-02T12:00:00Z",
		},
		{
			id: "3",
			owner: "Alice Johnson",
			title: "Board 3",
			last_opened: "2023-10-02T12:00:00Z",
		},
		{
			id: "4",
			owner: "John Doe",
			title: "Board 4",
			last_opened: "2023-10-02T12:00:00Z",
		},
		{
			id: "5",
			owner: "Jane Smith",
			title: "Board 5",
			last_opened: "2023-10-02T12:00:00Z",
		},
	]

	return (
		<div className="w-full md:max-w-[656px] lg:max-w-[992px] space-y-4">
			<BoardsDisplayHeader />
			<Separator className="w-full" />
			<Boards boards={boards} />
		</div>
	)
}
