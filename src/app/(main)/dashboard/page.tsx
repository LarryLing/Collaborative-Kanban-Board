import Dashboard from "@/components/blocks/dashboard/dashboard";
import { BoardType } from "@/lib/types";
import React from "react";

export default async function DashboardPage() {
	const fetchedBoards: BoardType[] = [
		{
			board_id: "1",
			owner_id: "John Doe",
			cover: undefined,
			collaborative: false,
			bookmarked: true,
			title: "apple",
			last_opened: "2025-02-14T06:00:00Z",
		},
		{
			board_id: "2",
			owner_id: "Jane Smith",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			collaborative: true,
			bookmarked: true,
			title: "board",
			last_opened: "2023-10-25T12:00:00Z",
		},
		{
			board_id: "3",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner_id: "Alice Johnson",
			collaborative: true,
			bookmarked: false,
			title: "card",
			last_opened: "2023-11-02T12:00:00Z",
		},
		{
			board_id: "4",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner_id: "John Doe",
			collaborative: true,
			bookmarked: false,
			title: "dashboard",
			last_opened: "2023-06-17T12:00:00Z",
		},
		{
			board_id: "5",
			cover: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
			owner_id: "Jane Smith",
			collaborative: false,
			bookmarked: true,
			title: "example",
			last_opened: "2023-09-06T12:00:00Z",
		},
	];

	return (
		<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
			<Dashboard fetchedBoards={fetchedBoards} />
		</div>
	);
}
