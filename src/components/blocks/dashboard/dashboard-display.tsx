"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import { Board as BoardType } from "@/lib/types";
import { processBoards } from "@/lib/utils";
import { ownership, sort, bookmarked, view } from "../../../lib/storage-utils";
import Board from "./board";
import { Button } from "@/components/ui/button";
import { createBoard } from "@/lib/actions";
import { Plus } from "lucide-react";

type DashboardDisplayProps = {
	id: string;
	boards: BoardType[];
	query: string;
};

export default function DashboardDisplay({
	id,
	boards,
	query,
}: DashboardDisplayProps) {
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
				return <Board key={board.id} board={board} view={viewState} />;
			})}
			<Button
				variant="ghost"
				className={`${viewState === "gallery" ? "h-[280px]" : "h-[56px] overflow-hidden pl-4 pr-2"} w-full flex items-center justify-center gap-2`}
				onClick={() => createBoard()}
			>
				<Plus className="size-4" />
				<span className="font-semibold text-md">New Board</span>
			</Button>
		</div>
	);
}
