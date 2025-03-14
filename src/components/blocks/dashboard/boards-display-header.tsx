"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
	ArrowDownAZ,
	Bookmark,
	LayoutGrid,
	List,
	Plus,
	Search,
} from "lucide-react";
import React, { useState } from "react";

type BoardsDisplayHeaderProps = {
	ownership: string;
	setOwnership: (arg0: string) => void;
	listView: boolean;
	setListView: (arg0: boolean) => void;
	bookmarked: boolean;
	setBookmarked: (arg0: boolean) => void;
	sortMethod: string;
	setSortMethod: (arg0: string) => void;
	query: string;
	setQuery: (arg0: string) => void;
};

export default function BoardsDisplayHeader({
	ownership,
	setOwnership,
	listView,
	setListView,
	bookmarked,
	setBookmarked,
	sortMethod,
	setSortMethod,
	query,
	setQuery,
}: BoardsDisplayHeaderProps) {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="font-semibold text-3xl">Dashboard</h2>
			<div className="flex justify-between">
				<Button>
					<Plus className="size-4" />
					<span>New Board</span>
				</Button>
				<div className="flex gap-2 items-center">
					<div className="md:flex hidden gap-2">
						<OwnershipDropdown
							ownership={ownership}
							setOwnership={setOwnership}
						/>
						<SortDropdown
							sortMethod={sortMethod}
							setSortMethod={setSortMethod}
						/>
						<ViewButton
							listView={listView}
							setListView={setListView}
						/>
						<BookmarkToggle
							bookmarked={bookmarked}
							setBookmarked={setBookmarked}
						/>
					</div>
					<div className="block md:hidden">
						<OptionsDropdown
							ownership={ownership}
							setOwnership={setOwnership}
							listView={listView}
							setListView={setListView}
							bookmarked={bookmarked}
							setBookmarked={setBookmarked}
							sortMethod={sortMethod}
							setSortMethod={setSortMethod}
						/>
					</div>
					<SearchBar query={query} setQuery={setQuery} />
				</div>
			</div>
		</div>
	);
}

type OwnershipDropdownProps = {
	ownership: string;
	setOwnership: (arg0: string) => void;
};

function OwnershipDropdown({
	ownership,
	setOwnership,
}: OwnershipDropdownProps) {
	return (
		<DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-[160px]">
								{ownership}
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>Ownership</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<DropdownMenuRadioGroup
					value={ownership}
					onValueChange={setOwnership}
				>
					<DropdownMenuRadioItem value="Owned by anyone">
						Owned by anyone
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Owned by me">
						Owned by me
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Not owned by me">
						Not owned by me
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type ViewButtonProps = {
	listView: boolean;
	setListView: (arg0: boolean) => void;
};

function ViewButton({ listView, setListView }: ViewButtonProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Toggle view"
						variant="outline"
						onClick={() => setListView(!listView)}
						size="icon"
					>
						{listView ? (
							<LayoutGrid className="size-4" />
						) : (
							<List className="size-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{listView ? "Gallery view" : "List view"}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

type BookmarkToggleProps = {
	bookmarked: boolean;
	setBookmarked: (arg0: boolean) => void;
};

function BookmarkToggle({ bookmarked, setBookmarked }: BookmarkToggleProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<Toggle
							aria-label="Toggle view"
							variant="outline"
							pressed={bookmarked}
							onPressedChange={() => setBookmarked(!bookmarked)}
						>
							<Bookmark className="size-4" />
						</Toggle>
					</div>
				</TooltipTrigger>
				<TooltipContent>Bookmarked</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

type SortDropdownProps = {
	sortMethod: string;
	setSortMethod: (arg0: string) => void;
};

function SortDropdown({ sortMethod, setSortMethod }: SortDropdownProps) {
	return (
		<DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="px-2 py-0">
								<ArrowDownAZ className="size-4" />
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>Sort Options</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<DropdownMenuRadioGroup
					value={sortMethod}
					onValueChange={setSortMethod}
				>
					<DropdownMenuRadioItem value="Last opened">
						Last opened
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Sort ascending">
						Sort ascending
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Sort descending">
						Sort descending
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type SearchBarProps = {
	query: string;
	setQuery: (arg0: string) => void;
};

function SearchBar({ query, setQuery }: SearchBarProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	return (
		<div className="hidden md:flex space-x-2">
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<div>
							<Toggle
								variant="outline"
								pressed={isSearchOpen}
								onPressedChange={() =>
									setIsSearchOpen(!isSearchOpen)
								}
							>
								<Search className="size-5" />
							</Toggle>
						</div>
					</TooltipTrigger>
					<TooltipContent>Search</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			{isSearchOpen && (
				<Input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-[100px] md:w-[150px] lg:w-[175px] text-sm"
					placeholder="Search..."
				/>
			)}
		</div>
	);
}

function OptionsDropdown({
	ownership,
	setOwnership,
	listView,
	setListView,
	bookmarked,
	setBookmarked,
	sortMethod,
	setSortMethod,
}: OwnershipDropdownProps &
	ViewButtonProps &
	BookmarkToggleProps &
	SortDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Options</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={ownership}
					onValueChange={setOwnership}
				>
					<DropdownMenuRadioItem value="Owned by anyone">
						Owned by anyone
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Owned by me">
						Owned by me
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Not owned by me">
						Not owned by me
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={sortMethod}
					onValueChange={setSortMethod}
				>
					<DropdownMenuRadioItem value="Last opened">
						Last opened
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Sort ascending">
						Sort ascending
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="Sort descending">
						Sort descending
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={listView ? "List view" : "Gallery view"}
				>
					<DropdownMenuRadioItem
						value="Gallery view"
						onSelect={() => setListView(false)}
					>
						<span>Gallery view</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						value="List view"
						onSelect={() => setListView(true)}
					>
						<span>List view</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={bookmarked ? "Bookmarked" : "All"}
				>
					<DropdownMenuRadioItem
						value="All"
						onSelect={() => setBookmarked(false)}
					>
						<span>All</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						value="Bookmarked"
						onSelect={() => setBookmarked(true)}
					>
						<span>Bookmarked</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
