"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { createBoard } from "@/lib/actions";
import OwnershipDropdown from "./ownership-dropdown";
import SortDropdown from "./sort-dropdown";
import ViewButton from "./view-button";
import BookmarkToggle from "./bookmark-toggle";
import SearchBar from "./search-bar";
import MobileDisplayOptions from "./mobile-display-options";

export default function DashboardHeader() {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="font-semibold text-3xl">Dashboard</h2>
			<div className="flex justify-between">
				<Button onClick={createBoard}>
					<Plus className="size-4" />
					<span>New Board</span>
				</Button>
				<div className="flex gap-2 items-center">
					<div className="md:flex hidden gap-2">
						<OwnershipDropdown />
						<SortDropdown />
						<ViewButton />
						<BookmarkToggle />
					</div>
					<div className="block md:hidden">
						<MobileDisplayOptions />
					</div>
					<SearchBar />
				</div>
			</div>
		</div>
	);
}
