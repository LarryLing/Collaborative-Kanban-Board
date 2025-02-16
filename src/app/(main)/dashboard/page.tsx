import Dashboard from "@/components/blocks/dashboard/dashboard"
import { BoardType } from "@/lib/types"
import React from "react"

export default async function DashboardPage() {
	const fetchedBoards: BoardType[] = [
		{
			id: "1",
			owner: "John Doe",
			cover: undefined,
			bookmarked: true,
			title: "apple",
			last_opened: "2025-02-14T06:00:00Z",
		},
		{
			id: "2",
			owner: "Jane Smith",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			bookmarked: true,
			title: "board",
			last_opened: "2023-10-25T12:00:00Z",
		},
		{
			id: "3",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner: "Alice Johnson",
			bookmarked: false,
			title: "card",
			last_opened: "2023-11-02T12:00:00Z",
		},
		{
			id: "4",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner: "John Doe",
			bookmarked: false,
			title: "dashboard",
			last_opened: "2023-06-17T12:00:00Z",
		},
		{
			id: "5",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner: "Jane Smith",
			bookmarked: true,
			title: "example",
			last_opened: "2023-09-06T12:00:00Z",
		},
	]

	return (
		<div className="py-4 px-8 w-full max-w-[450px] md:max-w-[656px] lg:max-w-[992px] space-y-4">
			<Dashboard fetchedBoards={fetchedBoards} />
		</div>
	)
}
