import { useSyncExternalStore } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toggle } from "@/components/ui/toggle";
import { Bookmark } from "lucide-react";
import { bookmarked, handleBookmarkedChange } from "../../../lib/storage-utils";

export default function BookmarkToggle() {
	const bookmarkedState = useSyncExternalStore(
		bookmarked.subscribe,
		bookmarked.getSnapshot,
	);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div>
						<Toggle
							aria-label="Toggle view"
							variant="outline"
							pressed={bookmarkedState === "true"}
							onPressedChange={() =>
								handleBookmarkedChange(
									bookmarkedState === "true" ? "false" : "true",
								)
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
