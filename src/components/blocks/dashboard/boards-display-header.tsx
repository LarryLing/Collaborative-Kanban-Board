"use client"

import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toggle } from "@/components/ui/toggle"
import {
	ArrowDownAZ,
	Bookmark,
	Check,
	LayoutGrid,
	List,
	Plus,
} from "lucide-react"
import React, { useState } from "react"

type OwnershipTypes = "Owned by anyone" | "Owned by me" | "Not owned by me"
type SortMethodTypes = "Last Opened" | "Sort Ascending" | "Sort Descending"

export default function BoardsDisplayHeader() {
	const [ownership, setOwnership] =
		useState<OwnershipTypes>("Owned by anyone")
	const [listView, setListView] = useState(false)
	const [bookmarked, setBookmarked] = useState(false)
	const [sortMethod, setSortMethod] = useState<SortMethodTypes>("Last Opened")

	return (
		<div className="w-full flex flex-col gap-4">
			<h2 className="font-semibold text-3xl">My Boards</h2>
			<div className="flex justify-between">
				<Button>
					<Plus className="size-4" /> New Board
				</Button>
				<div className="flex gap-2">
					<OwnershipDropdown
						ownership={ownership}
						setOwnership={setOwnership}
					/>
					<ViewToggle listView={listView} setListView={setListView} />
					<BookmarkToggle
						bookmarked={bookmarked}
						setBookmarked={setBookmarked}
					/>
					<SortDropdown
						sortMethod={sortMethod}
						setSortMethod={setSortMethod}
					/>
				</div>
			</div>
		</div>
	)
}

type OwnershipDropdownProps = {
	ownership: OwnershipTypes
	setOwnership: (arg0: OwnershipTypes) => void
}

function OwnershipDropdown({
	ownership,
	setOwnership,
}: OwnershipDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="w-[160px]">
					{ownership}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onSelect={() => setOwnership("Owned by anyone")}
				>
					{ownership === "Owned by anyone" ? (
						<Check className="size-4" />
					) : (
						<div className="size-4"></div>
					)}
					<span>Owned by anyone</span>
				</DropdownMenuItem>
				<DropdownMenuItem onSelect={() => setOwnership("Owned by me")}>
					{ownership === "Owned by me" ? (
						<Check className="size-4" />
					) : (
						<div className="size-4"></div>
					)}
					<span>Owned by me</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => setOwnership("Not owned by me")}
				>
					{ownership === "Not owned by me" ? (
						<Check className="size-4" />
					) : (
						<div className="size-4"></div>
					)}
					<span>Not owned by me</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

type ViewToggleProps = {
	listView: boolean
	setListView: (arg0: boolean) => void
}

function ViewToggle({ listView, setListView }: ViewToggleProps) {
	return (
		<Toggle
			aria-label="Toggle view"
			variant="outline"
			pressed={listView}
			onPressedChange={() => setListView(!listView)}
		>
			{listView ? (
				<List className="size-4" />
			) : (
				<LayoutGrid className="size-4" />
			)}
		</Toggle>
	)
}

type BookmarkToggleProps = {
	bookmarked: boolean
	setBookmarked: (arg0: boolean) => void
}

function BookmarkToggle({ bookmarked, setBookmarked }: BookmarkToggleProps) {
	return (
		<Toggle
			aria-label="Toggle view"
			variant="outline"
			pressed={bookmarked}
			onPressedChange={() => setBookmarked(!bookmarked)}
		>
			<Bookmark className="size-4" />
		</Toggle>
	)
}

type SortDropdownProps = {
	sortMethod: SortMethodTypes
	setSortMethod: (arg0: SortMethodTypes) => void
}

function SortDropdown({ sortMethod, setSortMethod }: SortDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="px-2 py-0">
					<ArrowDownAZ className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onSelect={() => setSortMethod("Last Opened")}>
					{sortMethod === "Last Opened" ? (
						<Check className="size-4" />
					) : (
						<div className="size-4"></div>
					)}
					<span>Last Opened</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => setSortMethod("Sort Ascending")}
				>
					{sortMethod === "Sort Ascending" ? (
						<Check className="size-4" />
					) : (
						<div className="size-4"></div>
					)}
					<span>Sort Ascending</span>
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => setSortMethod("Sort Descending")}
				>
					{sortMethod === "Sort Descending" ? (
						<Check className="size-4" />
					) : (
						<div className="size-4"></div>
					)}
					<span>Sort Descending</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
