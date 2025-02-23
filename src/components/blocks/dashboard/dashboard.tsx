"use client";

import { BoardType } from "@/lib/types";
import React, { useMemo, useState } from "react";
import BoardsDisplayHeader from "./boards-display-header";
import { Separator } from "@/components/ui/separator";
import GalleryView from "./gallery-view";
import ListView from "./list-view";
import SettingsDialog from "../settings-dialog/settings-dialog";

type DashboardProps = {
	fetchedBoards: BoardType[];
};

export default function Dashboard({ fetchedBoards }: DashboardProps) {
	const [ownership, setOwnership] = useState("Owned by anyone");
	const [listView, setListView] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [sortMethod, setSortMethod] = useState("Last opened");
	const [query, setQuery] = useState("");
	const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

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
				query={query}
				setQuery={setQuery}
			/>
			<Separator className="w-full" />
			{listView ? (
				<ListView boards={processedBoards} />
			) : (
				<GalleryView boards={processedBoards} />
			)}
		</>
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
