"use client";

import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
	return (
		<div className="py-4 px-8 w-full max-w-[450px] md:max-w-[656px] lg:max-w-[992px] space-y-4">
			<BoardsDisplayHeader
				ownership="Owned by anyone"
				setOwnership={(ownership: string) => {}}
				listView={false}
				setListView={(listView: boolean) => {}}
				bookmarked={false}
				setBookmarked={(bookmarked: boolean) => {}}
				sortMethod="Last opened"
				setSortMethod={(sortMethod: string) => {}}
				query=""
				setQuery={(qeury: string) => {}}
			/>
			<Separator className="w-full" />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Skeleton />
				<Skeleton />
				<Skeleton />
			</div>
		</div>
	);
}
