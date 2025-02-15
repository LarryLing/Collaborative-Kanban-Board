"use client"

import { BoardType } from "@/lib/types"
import React, { useState } from "react"
import BoardsDisplayHeader from "./boards-display-header"
import { Separator } from "@/components/ui/separator"
import GalleryView from "./gallery-view"
import ListView from "./list-view"

type DashboardProps = {
	boards: BoardType[]
}

export default function Dashboard({ boards }: DashboardProps) {
	const [ownership, setOwnership] = useState("Owned by anyone")
	const [listView, setListView] = useState(false)
	const [bookmarked, setBookmarked] = useState(false)
	const [sortMethod, setSortMethod] = useState("Last Opened")

	return (
		<>
			<BoardsDisplayHeader
				ownership={ownership}
				setOwnership={setOwnership}
				listView={listView}
				setListView={setListView}
				bookmarked={bookmarked}
				setBookmarked={setBookmarked}
				sortMethod={sortMethod}
				setSortMethod={setSortMethod}
			/>
			<Separator className="w-full" />
			{listView ? (
				<ListView boards={boards} />
			) : (
				<GalleryView boards={boards} />
			)}
		</>
	)
}
