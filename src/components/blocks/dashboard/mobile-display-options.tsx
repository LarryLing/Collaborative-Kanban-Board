import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { OwnershipOptions, SortOptions, ViewOptions } from "@/lib/types";
import { useSyncExternalStore } from "react";
import {
	bookmarked,
	handleBookmarkedChange,
	handleOwnershipChange,
	handleSortChange,
	handleViewChange,
	ownership,
	sort,
	view,
} from "../../../lib/storage-utils";

export default function MobileDisplayOptions() {
	const viewState = useSyncExternalStore(view.subscribe, view.getSnapshot);
	const sortState = useSyncExternalStore(sort.subscribe, sort.getSnapshot);
	const bookmarkedState = useSyncExternalStore(
		bookmarked.subscribe,
		bookmarked.getSnapshot,
	);
	const ownershipState = useSyncExternalStore(
		ownership.subscribe,
		ownership.getSnapshot,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline">Options</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup
					value={ownershipState}
					onValueChange={(value) =>
						handleOwnershipChange(value as OwnershipOptions)
					}
				>
					<DropdownMenuRadioItem value="anyone">
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
					value={sortState}
					onValueChange={(value) =>
						handleSortChange(value as SortOptions)
					}
				>
					<DropdownMenuRadioItem value="last-opened">
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
					value={viewState}
					onValueChange={(value) =>
						handleViewChange(value as ViewOptions)
					}
				>
					<DropdownMenuRadioItem value="gallery">
						<span>Gallery view</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="list">
						<span>List view</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup value={bookmarkedState}>
					<DropdownMenuRadioItem
						value="false"
						onSelect={() => handleBookmarkedChange("false")}
					>
						<span>All</span>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem
						value="true"
						onSelect={() => handleBookmarkedChange("true")}
					>
						<span>Bookmarked</span>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
