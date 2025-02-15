"use client"

import { BoardType } from "@/lib/types"
import React, { useState } from "react"
import BoardsDisplayHeader from "./boards-display-header"
import { Separator } from "@/components/ui/separator"
import GalleryItem, { NewBoardGalleryItem } from "./gallery-view"

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
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{boards.map((board) => {
					return <GalleryItem {...board} key={board.id} />
				})}
				<NewBoardGalleryItem />
			</div>
		</>
	)
}
