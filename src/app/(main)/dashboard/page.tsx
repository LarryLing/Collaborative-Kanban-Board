import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header"
import { Separator } from "@/components/ui/separator"
import React from "react"

export default async function DashboardPage() {
	return (
		<div className="w-full lg:max-w-[992px] max-w-[656px] space-y-4 p-8">
			<BoardsDisplayHeader />
			<Separator className="w-full" />
		</div>
	)
}
