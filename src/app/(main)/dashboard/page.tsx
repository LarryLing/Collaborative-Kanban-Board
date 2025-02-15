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
			cover: undefined,
			title: "Board 1",
			last_opened: "2025-02-14T06:00:00Z",
		},
		{
			id: "2",
			owner: "Jane Smith",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			title: "Board 2",
			last_opened: "2023-10-02T12:00:00Z",
		},
		{
			id: "3",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner: "Alice Johnson",
			title: "Board 3",
			last_opened: "2023-10-02T12:00:00Z",
		},
		{
			id: "4",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner: "John Doe",
			title: "Board 4",
			last_opened: "2023-10-02T12:00:00Z",
		},
		{
			id: "5",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner: "Jane Smith",
			title: "Board 5",
			last_opened: "2023-10-02T12:00:00Z",
		},
	]

	return (
		<div className="my-4 mx-8 w-full max-w-[450px] md:max-w-[656px] lg:max-w-[992px] space-y-4">
			<BoardsDisplayHeader />
			<Separator className="w-full" />
			<Boards boards={boards} />
		</div>
	)
}
