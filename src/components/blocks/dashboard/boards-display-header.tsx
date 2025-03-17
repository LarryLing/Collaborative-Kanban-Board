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
import {
	useSearchParams,
	usePathname,
	useRouter,
	ReadonlyURLSearchParams,
} from "next/navigation";
import { createBoard } from "@/lib/actions";
import { OwnershipOptions, SortOptions, ViewOptions } from "@/lib/types";
import { useDebouncedCallback } from "use-debounce";

export default function BoardsDisplayHeader() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const { replace } = useRouter();

	function handleOwnershipChange(ownership: OwnershipOptions) {
		const params = new URLSearchParams(searchParams);

		ownership
			? params.set("ownership", ownership)
			: params.delete("ownership");

		replace(`${pathname}?${params.toString()}`);
	}

	function handleSortChange(sortMethod: SortOptions) {
		const params = new URLSearchParams(searchParams);

		sortMethod ? params.set("sort", sortMethod) : params.delete("sort");

		replace(`${pathname}?${params.toString()}`);
	}

	function handleViewChange(view: ViewOptions) {
		const params = new URLSearchParams(searchParams);

		view ? params.set("view", view) : params.delete("view");

		replace(`${pathname}?${params.toString()}`);
	}

	function handleBookmarkedChange(bookmarked: boolean) {
		const params = new URLSearchParams(searchParams);

		bookmarked
			? params.set("bookmarked", "bookmarked")
			: params.delete("bookmarked");

		replace(`${pathname}?${params.toString()}`);
	}

	const handleSearch = useDebouncedCallback((query) => {
		const params = new URLSearchParams(searchParams);

		query ? params.set("query", query) : params.delete("query");

		replace(`${pathname}?${params.toString()}`);
	}, 500);

	return (
		<div className="flex flex-col gap-4">
			<h2 className="font-semibold text-3xl">Dashboard</h2>
			<div className="flex justify-between">
				<Button onClick={() => createBoard()}>
					<Plus className="size-4" />
					<span>New Board</span>
				</Button>
				<div className="flex gap-2 items-center">
					<div className="md:flex hidden gap-2">
						<OwnershipDropdown
							searchParams={searchParams}
							handleOwnershipChange={handleOwnershipChange}
						/>
						<SortDropdown
							searchParams={searchParams}
							handleSortChange={handleSortChange}
						/>
						<ViewButton
							searchParams={searchParams}
							handleViewChange={handleViewChange}
						/>
						<BookmarkToggle
							searchParams={searchParams}
							handleBookmarkedChange={handleBookmarkedChange}
						/>
					</div>
					<div className="block md:hidden">
						<OptionsDropdown
							searchParams={searchParams}
							handleOwnershipChange={handleOwnershipChange}
							handleSortChange={handleSortChange}
							handleViewChange={handleViewChange}
							handleBookmarkedChange={handleBookmarkedChange}
						/>
					</div>
					<SearchBar
						searchParams={searchParams}
						handleSearch={handleSearch}
					/>
				</div>
			</div>
		</div>
	);
}

type OwnershipDropdownProps = {
	searchParams: ReadonlyURLSearchParams;
	handleOwnershipChange: (arg0: OwnershipOptions) => void;
};

function OwnershipDropdown({
	searchParams,
	handleOwnershipChange,
}: OwnershipDropdownProps) {
	function getSelectedParam() {
		const param = searchParams.get("ownership");

		if (!param) {
			return "Owned by anyone";
		} else if (param === "me") {
			return "Owned by me";
		} else {
			return "Not owned by me";
		}
	}

	return (
		<DropdownMenu>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="w-[160px]">
								{getSelectedParam()}
							</Button>
						</DropdownMenuTrigger>
					</TooltipTrigger>
					<TooltipContent>Ownership</TooltipContent>
				</Tooltip>
			</TooltipProvider>
			<DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
				<DropdownMenuRadioGroup
					value={searchParams.get("ownership") || ""}
					onValueChange={(value) =>
						handleOwnershipChange(value as OwnershipOptions)
					}
				>
					<DropdownMenuRadioItem value="">
						Owned by anyone
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="me">
						Owned by me
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="not-me">
						Not owned by me
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type ViewButtonProps = {
	searchParams: ReadonlyURLSearchParams;
	handleViewChange: (arg0: ViewOptions) => void;
};

function ViewButton({ searchParams, handleViewChange }: ViewButtonProps) {
	const nextViewValue = searchParams.get("view") === null ? "list" : "";

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Toggle view"
						variant="outline"
						onClick={() => handleViewChange(nextViewValue)}
						size="icon"
					>
						{nextViewValue === "" ? (
							<LayoutGrid className="size-4" />
						) : (
							<List className="size-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{nextViewValue === "" ? "Gallery view" : "List view"}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

type BookmarkToggleProps = {
	searchParams: ReadonlyURLSearchParams;
	handleBookmarkedChange: (arg0: boolean) => void;
};

function BookmarkToggle({
	searchParams,
	handleBookmarkedChange,
}: BookmarkToggleProps) {
	const bookmarked = searchParams.get("bookmarked") ? true : false;

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<Toggle
							aria-label="Toggle view"
							variant="outline"
							pressed={bookmarked}
							onPressedChange={() =>
								handleBookmarkedChange(!bookmarked)
							}
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
	searchParams: ReadonlyURLSearchParams;
	handleSortChange: (arg0: SortOptions) => void;
};

function SortDropdown({ searchParams, handleSortChange }: SortDropdownProps) {
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
					value={searchParams.get("sort") || ""}
					onValueChange={(value) =>
						handleSortChange(value as SortOptions)
					}
				>
					<DropdownMenuRadioItem value="">
						Last opened
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="asc">
						Sort ascending
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="des">
						Sort descending
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

type SearchBarProps = {
	searchParams: ReadonlyURLSearchParams;
	handleSearch: (arg0: string) => void;
};

function SearchBar({ searchParams, handleSearch }: SearchBarProps) {
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
					onChange={(e) => {
						handleSearch(e.target.value);
					}}
					className="w-[100px] md:w-[150px] lg:w-[175px] text-sm"
					placeholder="Search..."
					defaultValue={searchParams.get("query")?.toString()}
				/>
			)}
		</div>
	);
}

function OptionsDropdown({
	searchParams,
	handleOwnershipChange,
	handleSortChange,
	handleViewChange,
	handleBookmarkedChange,
}: OwnershipDropdownProps &
	ViewButtonProps &
	BookmarkToggleProps &
	SortDropdownProps) {
	const nextViewValue = searchParams.get("view") === null ? "list" : "";
	const bookmarked = searchParams.get("bookmarked") ? true : false;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Options</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={searchParams.get("ownership") || ""}
					onValueChange={(value) =>
						handleOwnershipChange(value as OwnershipOptions)
					}
				>
					<DropdownMenuRadioItem value="">
						Owned by anyone
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="me">
						Owned by me
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="not-me">
						Not owned by me
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={searchParams.get("sort") || ""}
					onValueChange={(value) =>
						handleSortChange(value as SortOptions)
					}
				>
					<DropdownMenuRadioItem value="">
						Last opened
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="asc">
						Sort ascending
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="des">
						Sort descending
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={
						nextViewValue === "list" ? "List view" : "Gallery view"
					}
					onValueChange={(value) =>
						handleViewChange(value as ViewOptions)
					}
				>
					<DropdownMenuRadioItem value="">
						<span>Gallery view</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="list">
						<span>List view</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup
					value={bookmarked ? "Bookmarked" : "All"}
				>
					<DropdownMenuRadioItem
						value="All"
						onSelect={() => handleBookmarkedChange(false)}
					>
						<span>All</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						value="Bookmarked"
						onSelect={() => handleBookmarkedChange(true)}
					>
						<span>Bookmarked</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
