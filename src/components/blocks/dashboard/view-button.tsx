import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { LayoutGrid, List } from "lucide-react";
import { useSyncExternalStore } from "react";
import { handleViewChange, view } from "../../../lib/storage-utils";

export default function ViewButton() {
	const viewState = useSyncExternalStore(view.subscribe, view.getSnapshot);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						aria-label="Toggle view"
						variant="outline"
						onClick={() =>
							handleViewChange(viewState === "gallery" ? "list" : "gallery")
						}
						size="icon"
					>
						{viewState === "list" ? (
							<LayoutGrid className="size-4" />
						) : (
							<List className="size-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					{viewState === "list" ? "Gallery view" : "List view"}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
