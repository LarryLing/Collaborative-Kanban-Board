"use client";

import BoardsDisplayHeader from "@/components/blocks/dashboard/boards-display-header";
import GalleryView from "@/components/blocks/dashboard/gallery-view";
import ListView from "@/components/blocks/dashboard/list-view";
import { Separator } from "@/components/ui/separator";
import { processBoards } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { Tables } from "../../../../database.types";
import { UserProfile } from "@/lib/types";

type DashboardClientProps = {
	boards: Tables<"boards">[];
	userProfile: UserProfile;
};

export default function DashboardClientComponent({
	boards,
	userProfile,
}: DashboardClientProps) {
	const [ownership, setOwnership] = useState("Owned by anyone");
	const [listView, setListView] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [sortMethod, setSortMethod] = useState("Last opened");
	const [query, setQuery] = useState("");

	const processedBoards = useMemo(
		() =>
			processBoards(
				userProfile.id,
				boards,
				bookmarked,
				ownership,
				sortMethod,
				query,
			),
		[boards, bookmarked, ownership, sortMethod, query],
	);

	return (
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
	);
}
