"use client";

import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header";
import GalleryView from "@/components/blocks/dashboard/gallery-view";
import ListView from "@/components/blocks/dashboard/list-view";
import AuthenticatedNavigationBar from "@/components/blocks/misc/authenticated-navigation-bar";
import { Separator } from "@/components/ui/separator";
import { useBoards } from "@/hooks/use-boards";
import { useClientUser } from "@/hooks/use-client-user";
import { BoardType } from "@/lib/types";
import React, { useMemo, useState } from "react";

// const fetchedBoards: BoardType[] = [
// 	{
// 		boardId: "1",
// 		ownerId: "John Doe",
// 		coverPath: undefined,
// 		bookmarked: true,
// 		title: "apple",
// 		lastOpened: "2025-02-14T06:00:00Z",
// 	},
// 	{
// 		boardId: "2",
// 		ownerId: "Jane Smith",
// 		coverPath:
// 			"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
// 		bookmarked: true,
// 		title: "board",
// 		lastOpened: "2023-10-25T12:00:00Z",
// 	},
// 	{
// 		boardId: "3",
// 		coverPath:
// 			"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
// 		ownerId: "Alice Johnson",
// 		bookmarked: false,
// 		title: "card",
// 		lastOpened: "2023-11-02T12:00:00Z",
// 	},
// 	{
// 		boardId: "4",
// 		coverPath:
// 			"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
// 		ownerId: "John Doe",
// 		bookmarked: false,
// 		title: "dashboard",
// 		lastOpened: "2023-06-17T12:00:00Z",
// 	},
// 	{
// 		boardId: "5",
// 		coverPath:
// 			"https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
// 		ownerId: "Jane Smith",
// 		bookmarked: true,
// 		title: "example",
// 		lastOpened: "2023-09-06T12:00:00Z",
// 	},
// ];

export default function DashboardPage() {
	const { userProfile } = useClientUser();
	const { boards } = useBoards();

	const [ownership, setOwnership] = useState("Owned by anyone");
	const [listView, setListView] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [sortMethod, setSortMethod] = useState("Last opened");
	const [query, setQuery] = useState("");

	const processedBoards = useMemo(
		() => processBoards(boards, bookmarked, ownership, sortMethod, query),
		[boards, bookmarked, ownership, sortMethod, query],
	);

	return (
		<div className="flex flex-col justify-center items-center">
			<AuthenticatedNavigationBar userProfile={userProfile} />
			<div className="px-8 py-6 w-full max-w-[450px] md:max-w-[736px] lg:max-w-[1112px] space-y-6">
				<BoardsDisplayHeader
					ownership={ownership}
					setOwnership={setOwnership}
					listView={listView}
					setListView={setListView}
					bookmarked={bookmarked}
					setBookmarked={setBookmarked}
					sortMethod={sortMethod}
					setSortMethod={setSortMethod}
					query={query}
					setQuery={setQuery}
				/>
				<Separator className="w-full" />
				{listView ? (
					<ListView boards={processedBoards} />
				) : (
					<GalleryView boards={processedBoards} />
				)}
			</div>
		</div>
	);
}

function processBoards(
	fetchedBoards: BoardType[],
	bookmarked: boolean,
	ownership: string,
	sortMethod: string,
	query: string,
) {
	let processedBoards = [...fetchedBoards];

	if (bookmarked) {
		processedBoards = processedBoards.filter((board) => board.bookmarked);
	}

	if (ownership === "Owned by me") {
		processedBoards = processedBoards.filter(
			(board) => board.ownerId === "John Doe",
		);
	} else if (ownership === "Not owned by me") {
		processedBoards = processedBoards.filter(
			(board) => board.ownerId !== "John Doe",
		);
	}

	if (sortMethod === "Last opened") {
		processedBoards.sort(
			(a, b) =>
				new Date(b.lastOpened).getTime() -
				new Date(a.lastOpened).getTime(),
		);
	} else if (sortMethod === "Sort ascending") {
		processedBoards.sort((a, b) => a.title.localeCompare(b.title));
	} else if (sortMethod === "Sort descending") {
		processedBoards.sort((a, b) => b.title.localeCompare(a.title));
	}

	processedBoards = processedBoards.filter((board) =>
		board.title.toLowerCase().includes(query.toLowerCase()),
	);

	return processedBoards;
}
