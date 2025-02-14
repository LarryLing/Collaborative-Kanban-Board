import Boards from "@/components/blocks/dashboard/boards"
import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default async function DashboardPage() {
	const boards = [
		{
			id: "1",
			owner: "John Doe",
			title: "Board 1",
		},
		{
			id: "2",
			owner: "Jane Smith",
			title: "Board 2",
		},
		{
			id: "3",
			owner: "Alice Johnson",
			title: "Board 3",
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
