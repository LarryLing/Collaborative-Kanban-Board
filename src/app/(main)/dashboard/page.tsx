"use client";

import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header";
import GalleryView from "@/components/blocks/dashboard/gallery-view";
import ListView from "@/components/blocks/dashboard/list-view";
import AuthenticatedNavigationBar from "@/components/blocks/misc/authenticated-navigation-bar";
import { Separator } from "@/components/ui/separator";
import { useClientUser } from "@/hooks/use-client-user";
import { BoardType } from "@/lib/types";
import React, { useMemo, useState } from "react";

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

export default function DashboardPage() {
	const { userProfile } = useClientUser();

	const [ownership, setOwnership] = useState("Owned by anyone");
	const [listView, setListView] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [sortMethod, setSortMethod] = useState("Last opened");
	const [query, setQuery] = useState("");

	const processedBoards = useMemo(
		() =>
			processBoards(
				fetchedBoards,
				bookmarked,
				ownership,
				sortMethod,
				query,
			),
		[fetchedBoards, bookmarked, ownership, sortMethod, query],
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
			(board) => board.owner_id === "John Doe",
		);
	} else if (ownership === "Not owned by me") {
		processedBoards = processedBoards.filter(
			(board) => board.owner_id !== "John Doe",
		);
	}

	if (sortMethod === "Last opened") {
		processedBoards.sort(
			(a, b) =>
				new Date(b.last_opened).getTime() -
				new Date(a.last_opened).getTime(),
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
