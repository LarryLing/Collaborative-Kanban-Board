"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import { Board as BoardType } from "@/lib/types";
import { processBoards } from "@/lib/utils";
import { ownership, sort, bookmarked, view } from "../../../lib/storage-utils";
import Board from "./board";
import { MemoizedNewBoard } from "./new-board";

type DashboardContentProps = {
	id: string;
	boards: BoardType[];
	query: string;
};

export default function DashboardContent({
	id,
	boards,
	query,
}: DashboardContentProps) {
	const ownershipState = useSyncExternalStore(
		ownership.subscribe,
		ownership.getSnapshot,
	);
	const sortState = useSyncExternalStore(sort.subscribe, sort.getSnapshot);
	const bookmarkedState = useSyncExternalStore(
		bookmarked.subscribe,
		bookmarked.getSnapshot,
	);
	const viewState = useSyncExternalStore(view.subscribe, view.getSnapshot);

	const processedBoards = useMemo(
		() =>
			processBoards(
				id,
				boards,
				bookmarkedState,
				ownershipState,
				sortState,
				query,
			),
		[id, boards, bookmarkedState, ownershipState, sortState, query],
	);

	return (
		<div
			className={
				viewState === "gallery"
					? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
					: "space-y-2"
			}
		>
			{processedBoards.map((board) => {
				return <Board key={board.id} {...board} view={viewState} />;
			})}
			<MemoizedNewBoard viewState={viewState} />
		</div>
	);
}
