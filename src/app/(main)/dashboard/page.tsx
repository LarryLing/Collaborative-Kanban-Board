import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default async function DashboardPage() {
	return (
		<div className="w-[992px] space-y-4">
			<BoardsDisplayHeader />
			<Separator className="w-full" />
		</div>
	)
}
